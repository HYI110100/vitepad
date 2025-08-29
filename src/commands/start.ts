import { Command } from "commander";
import { StartCommand } from "~/types/commands";
import { logError } from "~/utils/logger";

/**
 * 命令行方式创建服务
 */
const command = async (options: Omit<StartCommand, 'all'>): Promise<void> => {
  try {


  } catch (error) {
    logError('创建服务失败', error);
  }
};

/**
 * 交互式创建服务
 */
const commandWithInquirer = async (_options: Partial<Omit<StartCommand, 'names' | 'all'>>): Promise<void> => {
  try {

  } catch (error) {
    logError('错误：', error);
  }
};

const commandByAll = async () => {
    try {

  } catch (error) {
    logError('错误：', error);
  }
}
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
        .option('-u, --update', '更新网站（根据创建是添加的dir目录，自动复制到网站目录）')
        .action(async (names, options) => {
            if (options?.all === true && names.length === 0) {
                await commandByAll()
                return
            }
            // 如果必填参数缺失，进入交互式补全
            if (names && names.length) {
                await command({ names, ...options });
            } else {
                await commandWithInquirer(options);
            }
        });
}