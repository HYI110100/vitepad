import { AppConfig, AppData, ServiceConfig } from "~/types/index.js";
import { getAppRootDir, parseProxyOptions } from '~/utils/index.js';
import JSONStorage from '~/utils/JSONStorage.js';
import path from 'path';
import { fileURLToPath } from "url";

let configStorage: JSONStorage<AppData> | null = null;

const rootDir = getAppRootDir('.vitepad');
const appConfig: AppConfig = {
    rootDir,
    isolateRoot: path.join(rootDir, 'services'),
    defaultPortStart: 3000,
};

async function configStorageInit() {
    // 获取当前文件的目录路径（ES Module 中需要这样处理）
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    const vitepadDemo: ServiceConfig = {
        id: 's_vitepad',
        distDir: path.join(__dirname, '..', 'test-dist'),
        workDir: path.join(appConfig.isolateRoot, 'VitepadDemo'),
        name: 'vitepad-demo',
        port: appConfig.defaultPortStart,
        proxy: parseProxyOptions([]),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
    configStorage = new JSONStorage<AppData>(
        path.join(appConfig.rootDir, 'data.json'),
        {
            services: {
                'vitepad': vitepadDemo,
            },
            config: {
                logLevel: 'info',
                defaultPortStart: appConfig.defaultPortStart,
            }
        }
    );

    await configStorage.init();
}
export { appConfig, configStorage, configStorageInit };