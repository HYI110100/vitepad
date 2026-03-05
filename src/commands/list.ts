import type { Command } from "commander"
import { logger } from "~/utils/logger.js";

/**
 * 注册命令到 Commander
 */
export const registerListCommand = (program: Command): void => {
  program
    .command('list')
    .alias('ls')
    .description('查看所有服务')
    .option('-d, --detail', '显示详细信息')
    .option('-j, --json', 'JSON格式输出')
    .option('-r, --run', '查看运行中的服务')
    .action(async (_options) => {
      try {

      } catch (error) {
        logger.error('获取服务列表失败:', error instanceof Error ? error.message : String(error));  
      }
    })
}