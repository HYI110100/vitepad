import { Command } from "commander";
import { CreateCommand } from "~/types/commands";
import { logError } from "~/utils/logger";

/**
 * 命令行方式创建服务
 */
const command = async (options: CreateCommand): Promise<void> => {
  try {


  } catch (error) {
    logError('创建服务失败', error);
  }
};

/**
 * 注册命令到 Commander
 */
export const registeListCommand = (program: Command): void => {
  program
    .command('list')
    .alias('ls')
    .description('列出所有网站服务或代理目标')
    .option('-d, --detail', '显示详细信息')
    .option('-j, --json', 'JSON格式输出')
    .action((options) => {
      command(options)
    })
}