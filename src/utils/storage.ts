import path from "path";
import fse from 'fs-extra';
import { logWarning, logError } from "./logger";

interface JSONStorageOptions {
    /** 如果文件不存在，init 时是否自动创建文件（默认 false） */
    initIfNotExist?: boolean;
    /** 如果文件不存在，是否把 defaultValue 写入磁盘（默认 true） */
    writeDefaultOnInit?: boolean;
    /** 写入 JSON 是否格式化（spaces）默认为 2 */
    spaces?: number;
    /** 文件编码，默认 utf-8 */
    encoding?: BufferEncoding;
    /** 是否自动保存（默认 false */
    autoSave?: boolean;
    /** 自动保存的延迟时间（毫秒，默认 500） */
    autoSaveDelay?: number;
}

export default class JSONStorage<T extends object = { [key: string]: any }> {
    private _data: T;
    private filePath: string;
    private opts: Required<JSONStorageOptions>;
    private defaultValue: T;
    private autoSaveTimeout: NodeJS.Timeout | null = null;
    private isInitialized: boolean = false;

    constructor(filePath: string, defaultValue?: T, options?: JSONStorageOptions) {
        this.filePath = path.resolve(filePath);
        this.opts = {
            initIfNotExist: false,
            writeDefaultOnInit: true,
            spaces: 2,
            encoding: 'utf-8',
            autoSave: false,
            autoSaveDelay: 500,
            ...(options || {})
        };
        this.defaultValue = defaultValue ? JSON.parse(JSON.stringify(defaultValue)) : {} as T;
        this._data = {} as T; // 在init中初始化实际数据
    }

    /**
     * 初始化：加载磁盘数据到内存
     */
    async init(): Promise<void> {
        if (this.isInitialized) {
            return;
        }

        try {
            const exists = await fse.pathExists(this.filePath);
            if (exists) {
                this._data = await fse.readJson(this.filePath);
            } else {
                if (this.opts.initIfNotExist) {
                    await this.writeToFile(this.opts.writeDefaultOnInit ? this.defaultValue : {});
                    logWarning(`文件不存在，已创建文件: ${this.filePath}`);
                }
                this._data = JSON.parse(JSON.stringify(this.defaultValue));
            }
            this.isInitialized = true;
        } catch (error) {
            logError(`初始化存储文件失败: ${this.filePath}`, error);
            throw error;
        }
    }

    /**
     * 获取数据
     * @param key 可选键名，不传则返回全部数据
     */
    get<K extends keyof T>(key?: K): K extends undefined ? T : T[K] {
        this.ensureInitialized();
        
        if (key === undefined) {
            return JSON.parse(JSON.stringify(this._data)) as any;
        }
        
        return this._data[key] as any;
    }

    /**
     * 设置数据（单个键值对）
     */
    async set<K extends keyof T>(key: K, value: T[K]): Promise<void>;
    /**
     * 设置数据（批量对象）
     */
    async set(data: Partial<T>): Promise<void>;
    async set<K extends keyof T>(arg1: K | Partial<T>, arg2?: T[K]): Promise<void> {
        this.ensureInitialized();

        if (typeof arg1 === 'object') {
            // 批量设置
            Object.assign(this._data, arg1);
        } else {
            // 单个键值对设置
            this._data[arg1 as K] = arg2 as T[K];
        }

        await this.scheduleSave();
    }

    /**
     * 更新数据（深度合并）
     */
    async update(data: Partial<T>): Promise<void> {
        this.ensureInitialized();
        
        this.deepMerge(this._data, data);
        await this.scheduleSave();
    }

    /**
     * 删除数据
     */
    async delete<K extends keyof T>(key: K): Promise<void> {
        this.ensureInitialized();

        if (key in this._data) {
            delete this._data[key];
            await this.scheduleSave();
        }
    }

    /**
     * 检查键是否存在
     */
    has<K extends keyof T>(key: K): boolean {
        this.ensureInitialized();
        return key in this._data;
    }

    /**
     * 获取所有键名
     */
    keys(): (keyof T)[] {
        this.ensureInitialized();
        return Object.keys(this._data) as (keyof T)[];
    }

    /**
     * 获取数据条数
     */
    size(): number {
        this.ensureInitialized();
        return Object.keys(this._data).length;
    }

    /**
     * 清空所有数据
     */
    async clear(): Promise<void> {
        this.ensureInitialized();
        
        // 清空但保留对象结构
        for (const key of Object.keys(this._data)) {
            delete this._data[key as keyof T];
        }
        
        await this.scheduleSave();
    }

    /**
     * 强制立即保存到文件
     */
    async forceSave(): Promise<void> {
        if (this.autoSaveTimeout) {
            clearTimeout(this.autoSaveTimeout);
            this.autoSaveTimeout = null;
        }
        
        await this.writeToFile(this._data);
    }

    /**
     * 重新从磁盘加载数据
     */
    async reload(): Promise<void> {
        try {
            const exists = await fse.pathExists(this.filePath);
            if (exists) {
                this._data = await fse.readJson(this.filePath);
            } else {
                this._data = JSON.parse(JSON.stringify(this.defaultValue));
            }
        } catch (error) {
            logError(`重新加载数据失败: ${this.filePath}`, error);
            throw error;
        }
    }

    /**
     * 私有方法：确保已初始化
     */
    private ensureInitialized(): void {
        if (!this.isInitialized) {
            throw new Error('JSONStorage 未初始化，请先调用 init() 方法');
        }
    }

    /**
     * 私有方法：深度合并对象
     */
    private deepMerge(target: any, source: any): void {
        for (const key of Object.keys(source)) {
            if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
                this.deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }

    /**
     * 私有方法：安排自动保存
     */
    private async scheduleSave(): Promise<void> {
        if (!this.opts.autoSave) {
            return;
        }

        if (this.autoSaveTimeout) {
            clearTimeout(this.autoSaveTimeout);
        }

        this.autoSaveTimeout = setTimeout(() => {
            this.forceSave().catch(error => {
                logError('自动保存失败', error);
            });
        }, this.opts.autoSaveDelay);
    }

    /**
     * 私有方法：安全写入文件
     */
    private async writeToFile(data: any): Promise<void> {
        try {
            // 确保目录存在
            await fse.ensureDir(path.dirname(this.filePath));
            
            // 原子写入：先写临时文件，再重命名
            const tempPath = `${this.filePath}.tmp`;
            await fse.writeJson(tempPath, data, {
                encoding: this.opts.encoding,
                spaces: this.opts.spaces
            });
            
            await fse.rename(tempPath, this.filePath);
        } catch (error) {
            logError(`写入文件失败: ${this.filePath}`, error);
            throw error;
        }
    }

    /**
     * 销毁实例，清理资源
     */
    async destroy(): Promise<void> {
        if (this.autoSaveTimeout) {
            clearTimeout(this.autoSaveTimeout);
            this.autoSaveTimeout = null;
        }
        
        // 确保所有挂起的保存操作完成
        await this.forceSave();
        this.isInitialized = false;
    }
}