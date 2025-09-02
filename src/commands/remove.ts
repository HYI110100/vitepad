import { Command } from "commander";
import inquirer, { DistinctQuestion } from "inquirer";
import { RemoveCommand } from "~/types/commands";
import { logError } from "~/utils/logger";

/**
 * 命令行方式创建服务
 */
const command = async (options: Omit<RemoveCommand, 'all'>): Promise<void> => {

};

/**
 * 交互式创建服务
 */
const commandWithInquirer = async (_options: Partial<Omit<RemoveCommand, 'names' | 'all'>>): Promise<void> => {

};

const commandByAll = async () => {
  const query: DistinctQuestion[] = [
    {
      type: 'confirm',
      name: 'continue',
      message: '确认删除全部吗?',
      default: true
    }
  ]
  const result = await inquirer.prompt(query);
  if (result.continue === true) {
    const services: any[] = []  // getServices()
    // await removeService(services.map(x => x.id))
  }
}
/**
 * 注册命令到 Commander
 */
export const registerRemoveCommand = (program: Command) => {
  program
    .command('remove')
    .alias('rm')
    .description('移除指定服务')
    .argument('[ServiceName...]', '服务的唯一标识名称')
    .option('-a, --all', '一键全部移除')
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