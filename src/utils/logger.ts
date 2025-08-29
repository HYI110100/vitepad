import chalk from 'chalk';

// 主题颜色配置
export const theme = {
  primary: chalk.hex('#3498db'),      // 主色调 - 蓝色
  success: chalk.hex('#2ecc71'),      // 成功 - 绿色
  warning: chalk.hex('#f39c12'),      // 警告 - 橙色
  error: chalk.hex('#e74c3c'),        // 错误 - 红色
  info: chalk.hex('#9b59b6'),         // 信息 - 紫色
  debug: chalk.hex('#95a5a6'),        // 调试 - 灰色
  highlight: chalk.hex('#f1c40f'),    // 高亮 - 金色
  muted: chalk.hex('#7f8c8d')         // 次要 - 深灰
};

// 图标和装饰
export const icons = {
  check: '✅',
  cross: '❌',
  warning: '⚠️ ',
  info: 'ℹ️ ',
  debug: '🐛',
  rocket: '🚀',
  folder: '📁',
  port: '🚪',
  link: '🔗',
  time: '⏰',
  list: '📋',
  service: '🔸',
  server: '🌐',
  trash: '🗑️ ',
  question: '❓'
};

export const logSection = (message: string) => {
  console.log(theme.primary.bold(`\n${message}`));
  console.log('─'.repeat(message.length * 2));
};

export const logSuccess = (message: string, details?: string) => {
  console.log(`${icons.check}  ${theme.success.bold(message)}`);
  if (details) {
    console.log(`   ${theme.muted(details)}`);
  }
};

export const logError = (message: string, error?: any) => {
  console.log(`${icons.cross}  ${theme.error.bold(message)}`);
  if (error) {
    console.log(`   ${theme.muted(error.message || error)}`);
  }
};

export const logWarning = (message: string, detail?: any) => {
  console.log(`${icons.warning}  ${theme.warning(message)}`);
  if (detail) {
    console.log(`   ${theme.muted(detail)}`);
  }
};

export const logInfo = (message: string) => {
  console.log(`${icons.info}  ${theme.info(message)}`);
};

export const logDebug = (message: string) => {
  if (process.env.DEBUG) {
    console.log(`${icons.debug}  ${theme.debug(message)}`);
  }
};
export const logCancelled = (message: string = "操作已取消", detail?: any) => {
  console.log(`${icons.cross}  ${theme.muted(message)}`);
  if (detail) {
    console.log(`   ${theme.muted(detail)}`);
  }
};
export const logWelcome = () => {
  console.log(`${chalk.blue.bold(`
╔══════════════════════════════════════════════╗
║                                              ║
║   ${chalk.yellow('🚀 VitePad')} - ${chalk.cyan('Vite多环境管理工具')}            ║
║                                              ║
╚══════════════════════════════════════════════╝`)}

${chalk.green('✨ 轻松管理多个Vite环境')}
${chalk.cyan('📦 并行测试、端口智能分配')}
${chalk.magenta('🌐 代理规则、隔离环境')}

`);
};