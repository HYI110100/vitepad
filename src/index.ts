import { logError } from '~/utils/logger';
import { program } from 'commander'
import { getVersion } from '~/utils/utils'
import chalk from 'chalk';
// 命令
import { registerRemoveCommand } from '~/commands/remove';
import { registeListCommand } from '~/commands/list';
import { registerEditCommand } from '~/commands/edit';
import { registerCreateCommand } from '~/commands/create';
import { registerStopCommand } from '~/commands/stop';
import { registerStartCommand } from '~/commands/start';

async function validateEnvironment() {
    // TODO: vite检查
}
async function initializeApp() {
    // TODO: 加载数据到内存
}
function initializeLogger() {

}
/**
 * 创建 CLI 程序
 */
async function createCLI() {
    const version = getVersion();

    program
        .name('vitepad')
        .alias('vpad')
        .version(version)
        .action(() => {
            console.info(`${chalk.blue.bold(`
╔══════════════════════════════════════════════╗
║                                              ║
║   ${chalk.yellow('🚀 VitePad')} - ${chalk.cyan('Vite多环境管理工具')}            ║
║                                              ║
╚══════════════════════════════════════════════╝`)}

${chalk.green('✨ 轻松管理多个Vite环境')}
${chalk.cyan('📦 并行测试、端口智能分配')}
${chalk.magenta('🌐 代理规则、隔离环境')}

`);

        });

    // 注册命令 
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
        // 1. 环境校验
        await validateEnvironment();

        // 2. 初始化
        await initializeApp();

        // 3.cli
        await createCLI()

        // 4. 日志初始化
        initializeLogger();

    } catch (error) {
        logError(`${error}`);
        process.exit(1);
    }
}
export { main };