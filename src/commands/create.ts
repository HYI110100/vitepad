import { Command } from "commander"
import inquirer, { DistinctQuestion } from "inquirer"
import { CreateCommand } from "~/types/commands"
import { logError } from "~/utils/logger"

/**
 * 命令行方式创建服务
 */
const command = async (options: CreateCommand): Promise<void> => {
  try {
    // 让Vite自动处理端口问题
    // 名称在命令进来时判断了，没名称不会走到这里的。
    // 名称是否唯一？唯一的话需要做个判断
    // TODO: 虽然vite自动处理端口，但我还是呀处理下配置端口不重复。如果指定端口，并且有重复的，要询问用户
    // TODO: 服务名称唯一性校验
    const form = {
      name: options.name,
      port: options?.port || 3000, // TODO: 3000值先占位，实际是一个方法，获取一个可用的端口
      dir: options?.dir || '',
      proxy: options.proxy || [],
      viteConfig: options.viteConfig
    }
    console.log(form)

  } catch (error) {
    logError('创建服务失败', error)
  }
}

/**
 * 交互式创建服务
 */
const commandWithInquirer = async (options: Partial<CreateCommand>): Promise<void> => {
  try {
    const query: DistinctQuestion[] = [
      {
        type: 'input',
        name: 'name',
        message: '服务名称:',
        validate: async (v: string) => {
          if (!v.trim()) return '服务名称不能为空！'
          return true
        }
      },
      {
        type: 'number',
        name: 'port',
        message: `端口号?:`,
        default: options.port
      },
      {
        type: 'input',
        name: 'dir',
        message: '输入构建输出目录路径?:',
        default: options.dir || ''
      },
      {
        type: 'input',
        name: 'proxy',
        message: '输入代理规则 (路径::目标地址, 多个用空格分隔)?:',
        default: options?.proxy?.join(' ') || '',
      },
      {
        type: 'input',
        name: 'viteConfig',
        message: '额外的vite配置目录路径 (仅preview相关参数有效)?:',
        default: options?.viteConfig || ''
      }
    ]

    const result = await inquirer.prompt(query)
    const form = {
      name: result.name,
      port: result?.port || 3000, // TODO: 3000值先占位，实际是一个方法，获取一个可用的端口
      dir: result?.dir || '',
      proxy: result.proxy || [],
      viteConfig: result.viteConfig
    }
    console.log(form);

  } catch (error) {
    logError('错误：', error)
  }
}

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
    .option('-d, --dir <path>', '构建输出目录路径 (初次创建时会复制内容到隔离环境目录)')
    .option('-x, --proxy <target::host...>', '代理规则格式：路径::目标地址，如：/api::http://api.example.com')
    .option('-c, --vite-config <path>', '指定 vite 配置文件路径 (仅preview相关参数有效)')
    .action(async (name, options) => {
      if (name) {
        // 命令行模式
        await command({ name, ...options })
      } else {
        // 交互式模式
        await commandWithInquirer(options)
      }
    })
}