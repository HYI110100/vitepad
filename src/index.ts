import { registerLogsCommand } from '@/commands/logs.js';

async function validateEnvironment() {
    // TODO: vite检查
    throw new Error('模拟错误')
}
async function initializeApp() {
    // TODO: 校验数据完整性、合法性
    // TODO: 加载数据到内存
}
/**
 * 创建 CLI 程序
 */
async function createCLI() {
    // 从 package.json 导入版本号
    const { readFile } = await import('fs/promises');
    const { dirname, join } = await import('path');
    const { fileURLToPath } = await import('url');
    
    // 获取当前文件的目录路径
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    
    // 读取 package.json
    const packageJsonPath = join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'));
    const version = packageJson.version;

    const { program } = await import('commander');
    program
        .name('vitepad')
        .alias('vpad')
        .version(version)
        .action(async () => {
            const { welcome } = await import('./utils/logger.js');
            welcome()
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
        import('@/commands/remove.js'),
        import('@/commands/list.js'),
        import('@/commands/edit.js'),
        import('@/commands/create.js'),
        import('@/commands/stop.js'),
        import('@/commands/start.js'),
        import('@/commands/logs.js')
    ])

    // 注册所有命令
    registerCreateCommand(program)
    registerRemoveCommand(program)
    registeListCommand(program)
    registerEditCommand(program)
    registerStartCommand(program)
    registerStopCommand(program)
    registerLogsCommand(program)
    program.parse();
}

/**
 * 主函数
 */
async function main(): Promise<void> {
    // 环境校验
    await validateEnvironment();

    // 初始化
    await initializeApp();

    // 初始化cli
    await createCLI()
}
export { main };