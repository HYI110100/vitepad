import type { Command } from "commander"
import { logger } from "~/utils/logger.js"

/**
 * 注册命令到 Commander
 */
export const registerEditCommand = (program: Command): void => {
  program
    .command('edit')
    .alias('ed')
    .description('编辑服务配置')
    .argument('[name]', '服务的唯一标识名称')
    .option('-p, --port <number>', '指定服务运行的端口号')
    .option('-d, --dir <path>', '构建输出目录路径')
    .option('-x, --proxy <target::host...>', '代理规则格式：路径::目标地址，如：/api::http://api.example.com')
    .option("-a, --append", "对 proxy 字段使用追加模式（默认覆盖）", false)
    .option('-c, --vite-config <path>', '指定 vite 配置文件路径 (仅preview相关参数有效)')
    .action(async (_name,_options) => {
      try {
       
      } catch (error) {
        logger.error('编辑服务失败:', error instanceof Error ? error.message : String(error));
      }
    })
}