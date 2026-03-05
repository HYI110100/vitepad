import type { Command } from "commander"
import { logger } from "~/utils/logger.js"

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
    .option('-f, --from <path>', '项目构建产物目录，用于复制到隔离环境')
    .option('-t, --to <path>', '隔离环境目录，用于运行服务')
    // .option('-d, --project-dir <path>', '项目源代码目录路径') TODO:: 待实现
    .option('-x, --proxy <target::host...>', '代理规则格式：路径::目标地址，如：/api::http://api.example.com')
    .option('-e, --env <key=value...>', '环境变量格式：键=值，如：NODE_ENV=production')
    .option('-c, --vite-config <path>', '指定 vite 配置文件路径 (仅preview相关参数有效)')
    .option('-r, --run', '是否直接运行服务 (默认不运行)')
    .action(async (_name, _options) => {
      try {
      
      } catch (error) {
        logger.error('创建服务失败:', error instanceof Error ? error.message : String(error));
      }
    })
}