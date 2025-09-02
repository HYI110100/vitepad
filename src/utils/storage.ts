import path from "path";
import fse from 'fs-extra';
import { logInfo } from "./logger";

interface JSONStorageOptions {
    /** 如果文件不存在，init 时是否自动创建文件（默认 false） */
    initIfNotExist?: boolean;
    /** 如果文件不存在，是否把 defaultValue 写入磁盘（默认 true） */
    writeDefaultOnInit?: boolean;
    /** 写入 JSON 是否格式化（spaces）默认为 2 */
    spaces?: number;
    /** 文件编码，默认 utf-8 */
    encoding?: BufferEncoding;
}
export default class JSONStorage<T = { [key: string]: any }> {
    _data: T;
    filePath: string;
    private opts: Required<JSONStorageOptions>;
    private defaultValue: T;

    constructor(filePath: string, defaultValue?: T, options?: JSONStorageOptions) {
        this.filePath = path.resolve(filePath);
        this.opts = {
            initIfNotExist: false,
            writeDefaultOnInit: true,
            spaces: 2,
            encoding: 'utf-8',
            ...(options || {})
        }
        this._data = {} as T
        this.defaultValue = defaultValue || {} as T
    }

    /**
    * 初始化：加载磁盘数据到内存（如果不存在，可根据选项创建/写入默认值）
    */
    async init() {
        const exists = await fse.pathExists(this.filePath);
        if (exists) {
            this._data = await fse.readJson(this.filePath);
        } else {
            if (this.opts.initIfNotExist) {
                await fse.writeJson(this.filePath, this.opts.writeDefaultOnInit ? this.defaultValue : {}, { encoding: this.opts.encoding, spaces: this.opts.spaces });
                logInfo(`文件不存在，已创建文件:${this.filePath}`)
            }
            this._data = JSON.parse(JSON.stringify(this.defaultValue))
        }
    }
}