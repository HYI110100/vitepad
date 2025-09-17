import { Command } from "commander";
import { ListCommand } from "~/types/commands";
import { icons, logError, logRunWarning, theme } from "~/utils/logger";
import util from "util";
import { getServices } from "~/storage/service";

/**
 * 命令行方式创建服务
 */
const command = async (options: ListCommand): Promise<void> => {

  const services = await getServices()
  if (options.json === true && options.detail === true) {
    const serviceDetails = services
    console.log(util.inspect(serviceDetails.map(x => {
      const item = {
        id: x.id,
        name: x.name,
        port: x.port,
        createdAt: x.createdAt,
        updatedAt: x.updatedAt,
        proxies: x.proxies || []
      } as any
      if (x.dir) {
        item.dir = x.dir
      }
      if (x.dist) {
        item.dist = x.dist
      }
      if (x.viteConfig) {
        item.viteConfig = x.viteConfig
      }
      return item
    }), {
      depth: null,        // 显示无限层级
      colors: true,       // 彩色输出
      showHidden: false,  // 不显示隐藏属性
      compact: false      // 每个属性换行显示
    }));
    return
  }
  if (options.json === true) {
    console.log(services.map(x => {
      const item = {
        id: x.id,
        name: x.name,
        port: x.port,
        createdAt: x.createdAt,
        updatedAt: x.updatedAt,
        proxies: x.proxies?.length || 0
      } as any
      if (x.dir) {
        item.dir = x.dir
      }
      if (x.dist) {
        item.dist = x.dist
      }
      if (x.viteConfig) {
        item.viteConfig = x.viteConfig
      }
      return item
    }))
    return
  }
  if (options.detail === true) {
    const serviceDetails = services
    serviceDetails.forEach((item) => {
      console.log(`\n${icons.service}  ${theme.highlight.bold(item.id)}`);
      console.log(`   ${icons.title}  名称: ${theme.muted(item.name)}`);
      console.log(`   ${icons.port}  端口: ${theme.highlight(item.port)}`);
      if (item.dist)
        console.log(`   ${icons.folder}  构建目录: ${theme.muted(item.dist)}`);
      if (item.dir)
        console.log(`   ${icons.folder}  项目目录: ${theme.muted(item.dir)}`);
      if (item.viteConfig)
        console.log(`   ${icons.title}  Vite 配置: ${theme.muted(item.viteConfig)}`);
      console.log(`   ${icons.time}  创建: ${theme.muted(new Date(item.createdAt).toLocaleString())}`);
      console.log(`   ${icons.time}  更新: ${theme.muted(new Date(item.updatedAt).toLocaleString())}`);
      console.log(`   ${icons.link}  代理: ${theme.info(`${item.proxies?.length || 0} 个规则`)}`);
      if (item.proxies && item.proxies.length) {
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

  const tableData = services.map(x => ({
    ID: x.id,
    NAME: x.name,
    PORT: x.port,
    PROPX_NUM: x.proxies?.length,
    CREATION_TIME: new Date(x.createdAt).toLocaleString(),
    UPDATE_TIME: new Date(x.updatedAt).toLocaleString()
  }))
  console.table(tableData);
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
    .action(async (options) => {
      try {
        if(logRunWarning()){
          return
        }
        await command(options)
      } catch (error) {
        logError('程序被意外中断', error);
      }
    })
}