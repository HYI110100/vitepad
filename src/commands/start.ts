import type { Command } from "commander"
import { logger } from "~/utils/logger.js";

/**
 * 注册命令到 Commander
 */
export const registerStartCommand = (program: Command): void => {
  program
    .command('start')
    .alias('st')
    .description('启动指定服务')
    .argument('[ServiceName...]', '服务的唯一标识名称')
    .option('-a, --all', '一键全部启动')
    .option('-u, --update', '更新构建产物到隔离环境目录')
    .action(async (_names, _options) => {
      try {
      
      } catch (error) {
        logger.error('启动服务失败:', error instanceof Error ? error.message : String(error)); 
      }
    });
}