import { Command } from "commander";
import { CreateCommand } from "~/types/commands";
import { logError, logInfo } from "~/utils/logger";

/**
 * 命令行方式创建服务
 */
const command = async (options: CreateCommand): Promise<void> => {

};

/**
 * 交互式创建服务
 */
const commandWithInquirer = async (options: Partial<CreateCommand>): Promise<void> => {

};

/**
 * 注册命令到 Commander
 */
export const registerEditCommand = (program: Command): void => {
  program
    .command('edit')
    .alias('ed')
    .description('编辑指定服务')
    .argument('[name]', '服务的唯一标识名称')
    .option('-p, --port <number>', '指定服务运行的端口号 (默认自动分配)')
    .option('-d, --dir <path>', '构建输出目录路径')
    .option('-x, --proxy <target::host...>', '代理规则格式：路径::目标地址，如：/api::http://api.example.com')
    .option("-a, --append", "对 proxy 字段使用追加模式（默认覆盖）", false)
    .option('-c, --vite-config <path>', '指定 vite 配置文件路径 (仅preview相关参数有效)')
    .action(async (name, options) => {
      logInfo("开发中，暂不支持");
      return
      try {
        if (name) {
          // 命令行模式
          await command({ name, ...options });
        } else {
          // 交互式模式
          await commandWithInquirer(options);
        }
      } catch (error) {
        logError('程序被意外中断', error);
      }
    })
}