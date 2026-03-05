import type { Command } from "commander"
import { logger } from "~/utils/logger.js";

/**
 * 注册命令到 Commander
 */
export const registerRemoveCommand = (program: Command): void => {
  program
    .command('remove')
    .alias('rm')
    .description('移除指定服务')
    .argument('[ServiceName...]', '服务的唯一标识名称')
    .option('-a, --all', '一键全部移除')
    .action(async (_names, _options) => {
      try {
      
      } catch (error) {
        logger.error('移除服务失败:', error instanceof Error ? error.message : String(error));
      }
    });
}