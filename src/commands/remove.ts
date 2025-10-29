import type { Command } from "commander";

/**
 * 注册命令到 Commander
 */
export const registerRemoveCommand = (program: Command) => {
  program
    .command('remove')
    .alias('rm')
    .description('移除指定服务')
    .argument('[ServiceName...]', '服务的唯一标识名称')
    .option('-a, --all', '一键全部移除')
    .action(async (names, options) => {
      
    });
}