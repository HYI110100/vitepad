import { Command } from "commander";

/**
 * 注册命令到 Commander
 */
export const registeListCommand = (program: Command): void => {
  program
    .command('list')
    .alias('ls')
    .description('查看所有服务')
    .option('-d, --detail', '显示详细信息')
    .option('-j, --json', 'JSON格式输出')
    .option('-r, --run', '查看运行中的服务')
    .action(async (options) => {

    })
}