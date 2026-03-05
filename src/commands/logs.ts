import type { Command } from "commander"
import { logger } from "~/utils/logger.js"

/**
 * 注册命令到 Commander
 */
export const registerLogsCommand = (program: Command): void => {
  program
    .command('logs')
    .description('查看服务日志')
    .argument('[name]', '服务的唯一标识名称')
    .option('-f, --follow', '实时跟随日志')
    .option('-n, --lines <number>', '显示最近的行数', '100')
    .action(async (_name, _options) => {
      try {
      
      } catch (error) {
        logger.error('查看服务日志失败:', error instanceof Error ? error.message : String(error));
      }
    })
}