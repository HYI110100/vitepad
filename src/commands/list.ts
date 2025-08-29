import { Command } from "commander";
import {  ListCommand } from "~/types/commands";
import { icons, logError, theme } from "~/utils/logger";
import util from "util";

/**
 * 命令行方式创建服务
 */
const command = async (options: ListCommand): Promise<void> => {
  try {
  const data:any[] = []  // getServices()
    if (!data.length) {
      console.log(`\n${icons.info}  ${theme.muted('暂无服务配置')}`);
      console.log(`${theme.muted('使用 ')}${theme.highlight('vitepad caeate <服务名>')}${theme.muted(' 快速添加新服务')}`);
      return
    }
    if (options.json === true && options.detail === true) {
      const dataDetails: any[] = [] // getServicesByDetails()
      console.log(util.inspect(dataDetails, {
        depth: null,        // 显示无限层级
        colors: true,       // 彩色输出
        showHidden: false,  // 不显示隐藏属性
        compact: false      // 每个属性换行显示
      }));
      return
    }
    if (options.json === true) {
      console.log(data)
      return
    }
    if (options.detail === true) {
      const dataDetails: any[] = [] // getServicesByDetails()
      dataDetails.forEach((item, i) => {
        console.log(`\n${icons.service}  ${theme.highlight.bold(item.id)}`);
        console.log(`   ${icons.folder}  目录: ${theme.muted(item.name)}`);
        console.log(`   ${icons.folder}  目录: ${theme.muted(item.directory)}`);
        console.log(`   ${icons.port}  端口: ${theme.highlight(item.port)}`);
        console.log(`   ${icons.time}  创建: ${theme.muted(new Date(item.createdAt).toLocaleString())}`);
        console.log(`   ${icons.time}  更新: ${theme.muted(new Date(item.updatedAt).toLocaleString())}`);
        console.log(`   ${icons.link}  代理: ${theme.info(`${item.proxies.length} 个规则`)}`);
        if (item.proxies.length) {
          const tablePropxData = item.proxies.map((x: any) => ({
            ID: x.id,
            PATH: x.path,
            TARGET: x.target
          }))
          console.table(tablePropxData);
        }
      })
      return
    }

    const tableData = data.map(x => ({
      ID: x.id,
      NAME: x.name,
      PORT: x.port,
      PROPX_NUM: x.proxies.length,
      CREATION_TIME: new Date(x.createdAt).toLocaleString(),
      UPDATE_TIME: new Date(x.updatedAt).toLocaleString()
    }))
    console.table(tableData);


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
    .description('查看所有服务')
    .option('-d, --detail', '显示详细信息')
    .option('-j, --json', 'JSON格式输出')
    .option('-r, --run', '查看运行中的服务')
    .action((options) => {
      command(options)
    })
}