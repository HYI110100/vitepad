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
 * 交互式创建服务
 */
const commandWithInquirer = async (options: Partial<CreateCommand>): Promise<void> => {
  try {

  } catch (error) {
    logError('错误：', error);
  }
};

/**
 * 注册命令到 Commander
 */
export const registerCreateCommand = (program: Command): void => {
  program
    .command('create')
    .alias('cr')
    .description('创建新的服务')
    .argument('[name]', '服务的唯一标识名称')
    .option('-p, --port <number>', '指定服务运行的端口号 (默认自动分配)')
    .option('-d, --dir <path>', '构建输出目录路径 (初次创建时会复制内容到隔离环境)')
    .option('-x, --proxy <target::host...>', '代理规则格式：路径::目标地址，如：/api::http://api.example.com')
    .option('-c, --vite-config <path>', '指定 vite 配置文件路径 (仅preview相关参数有效)')
    .action(async (name, options) => {
      if (name) {
        // 命令行模式
        await command({ name, ...options });
      } else {
        // 交互式模式
        await commandWithInquirer(options);
      }
    })
}