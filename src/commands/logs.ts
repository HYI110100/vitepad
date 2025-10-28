import { Command } from "commander";

/**
 * 查看服务日志
 */
export const registerLogsCommand = (program: Command): void => {
  program
    .command('logs')
    .description('查看服务日志')
    .action(async (name, options) => {
      
    })
}