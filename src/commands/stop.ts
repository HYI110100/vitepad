import type { Command } from "commander";

/**
 * 注册命令到 Commander
 */
export const registerStopCommand = (program: Command): void => {
  program
    .command('stop')
    .alias('sp')
    .description('停止指定服务')
    .argument('[ServiceName...]', '服务的唯一标识名称')
    .option('-a, --all', '一键全部停止')
    .action(async (names, options) => {
      
    });
}