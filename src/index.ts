
// 加载环境变量
import dotenv from 'dotenv';
dotenv.config({ path: ['.env.dev'], quiet: true })

import { logger, welcome } from './utils/logger.js';

/**
 * 应用初始化
 */
async function initializeApp(): Promise<void> {
    try {
        const { configStorageInit } = await import('~/store/index.js');
        await configStorageInit();
    } catch (error) {
        logger.error('初始化失败:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

/**
 * 创建 CLI 程序
 */
async function createCLI(): Promise<void> {
    // 获取版本号
    const { getVersion } = await import('~/utils/index.js');
    const VERSION = await getVersion();
    // 初始化 Commander 程序
    const { program } = await import('commander');
    program
        .name('vitepad')
        .alias('vpad')
        .version(VERSION)
        .action(() => {
            // 无命令时显示欢迎信息
            welcome();
        });
    // 注册所有命令
    const [
        { registerRemoveCommand },
        { registerListCommand },
        { registerEditCommand },
        { registerCreateCommand },
        { registerStopCommand },
        { registerStartCommand },
        { registerLogsCommand }
    ] = await Promise.all([
        import('~/commands/remove.js'),
        import('~/commands/list.js'),
        import('~/commands/edit.js'),
        import('~/commands/create.js'), 
        import('~/commands/stop.js'),
        import('~/commands/start.js'),
        import('~/commands/logs.js')
    ])
    registerCreateCommand(program)
    registerRemoveCommand(program)
    registerListCommand(program)
    registerEditCommand(program)
    registerStartCommand(program)
    registerStopCommand(program)
    registerLogsCommand(program)
    // 解析命令行参数
    program.parse();
}

/**
 * 主函数
 */
async function main(): Promise<void> {
    try {
        // 初始化
        await initializeApp();

        // 启动 CLI
        await createCLI();

    } catch (error) {
        logger.error('程序运行失败:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

// 导出主函数
export { main };