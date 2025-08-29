import { Command } from "commander";
import { RemoveCommand } from "~/types/commands";
import { logError } from "~/utils/logger";

/**
 * 命令行方式创建服务
 */
const command = async (options: Omit<RemoveCommand, 'all'>): Promise<void> => {
  try {


  } catch (error) {
    logError('创建服务失败', error);
  }
};

/**
 * 交互式创建服务
 */
const commandWithInquirer = async (_options: Partial<Omit<RemoveCommand, 'names' | 'all'>>): Promise<void> => {
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
export const registerRemoveCommand = (program: Command): void => {
  program
        .command('remove')
        .alias('rm')
        .description('移除指定服务')
        .argument('[ServiceName...]', '服务的唯一标识名称')
        .option('-a, --all', '一键全部移除')
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