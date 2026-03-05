import { AppConfig, AppData } from "~/types/index.js";
import { getAppRootDir } from '~/utils/index.js';
import JSONStorage from '~/utils/JSONStorage.js';
import path from 'path';

let configStorage: JSONStorage<AppData> | null = null;

const rootDir = getAppRootDir('.vitepad');
const appConfig: AppConfig = {
    rootDir,
    isolateRoot: path.join(rootDir, 'services'),
};

async function configStorageInit() {
    configStorage = new JSONStorage<AppData>(
        path.join(appConfig.rootDir, 'data.json'),
        {
            services: {},
            config: {
                logLevel: 'info',
                defaultPortStart: 3000,
            }
        },
        {
            initIfNotExist: true,
        }
    );

    await configStorage.init();
}
export { appConfig, configStorage, configStorageInit };