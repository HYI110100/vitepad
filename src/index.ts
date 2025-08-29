// 命令

async function validateEnvironment() {
    // TODO: vite检查
}
async function initializeApp() {
    // TODO: 加载数据到内存
}
/**
 * 创建 CLI 程序
 */
async function createCLI() {
    const packagePath = require('path').join(__dirname, "..", "package.json");
    const version = require(packagePath).version;
    const { program } = await import('commander')
    program
        .name('vitepad')
        .alias('vpad')
        .version(version)
        .action(() => {
            const { logWelcome } = require('./utils/logger');
            logWelcome()
        });
    // 注册命令 
    const [
        { registerRemoveCommand },
        { registeListCommand },
        { registerEditCommand },
        { registerCreateCommand },
        { registerStopCommand },
        { registerStartCommand }
    ] = await Promise.all([
        import('~/commands/remove'),
        import('~/commands/list'),
        import('~/commands/edit'),
        import('~/commands/create'),
        import('~/commands/stop'),
        import('~/commands/start')
    ])

    // 注册所有命令
    registerCreateCommand(program)
    registerRemoveCommand(program)
    registeListCommand(program)
    registerEditCommand(program)
    registerStartCommand(program)
    registerStopCommand(program)

    // 解析命令行参数
    program.parse();
}

/**
 * 主函数
 */
async function main(): Promise<void> {
    try {
        // 环境校验
        await validateEnvironment();

        // 初始化
        await initializeApp();

        // 初始化cli
        await createCLI()


    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
export { main };