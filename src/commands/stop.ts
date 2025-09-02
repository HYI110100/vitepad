import { Command } from "commander";
import { StopCommand } from "~/types/commands";
import { logError } from "~/utils/logger";

/**
 * 命令行方式创建服务
 */
const command = async (options: Omit<StopCommand, 'all'>): Promise<void> => {
  try {


  } catch (error) {
    logError('创建服务失败', error);
  }
};

/**
 * 交互式创建服务
 */
const commandWithInquirer = async (_options: Partial<Omit<StopCommand, 'names' | 'all'>>): Promise<void> => {

};

const commandByAll = async () => {

}
/**
 * 注册命令到 Commander
 */
export const registerStopCommand = (program: Command): void => {
  program
    .command('stop')
    .alias('sp')
    .description('停止指定服务')
    .argument('[ServiceName...]', '服务的唯一标识名称')
    .option('-a, --all', '一键全部停止')
    .action(async (names, options) => {
      try {
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
      } catch (error) {

        logError('程序被意外中断', error);
      }
    });
}