import chalk from 'chalk';

// 基础日志函数
export const log = {
  // 普通信息
  info: (message: string) => console.log(chalk.blue('→'), message),
  
  // 成功
  success: (message: string) => console.log(chalk.green('✓'), message),
  
  // 错误
  error: (message: string, detail?: string) => {
    console.log(chalk.red('✗'), chalk.red(message));
    if (detail) console.log(chalk.gray('  ' + detail));
  },
  
  // 警告
  warn: (message: string) => console.log(chalk.yellow('!'), message),
  
  // 调试信息
  debug: (message: string) => console.log(chalk.gray('›'), chalk.gray(message)),
  
  // 纯文本（无前缀）
  text: (message: string) => console.log(message),
  
  // 空行
  br: () => console.log()
};

// 标题和分隔
export const title = (message: string) => {
  console.log(chalk.cyan.bold(`\n${message}`));
  console.log(chalk.cyan('─'.repeat(message.length)));
};

// 副标题
export const subtitle = (message: string) => {
  console.log(chalk.blue.bold(`\n${message}:`));
};

// 步骤提示
export const step = (message: string) => {
  console.log(chalk.magenta('•'), chalk.bold(message));
};

// 键值对信息
export const kv = (key: string, value: string) => {
  console.log(chalk.gray(`  ${key}:`), value);
};
// 欢迎信息
export const welcome = () => {
  console.log(chalk.blue.bold(`
╔══════════════════════════════════════════════╗
║                                              ║
║   ${chalk.yellow('🚀 VitePad')} - ${chalk.cyan('Vite多环境管理工具')}            ║
║                                              ║
╚══════════════════════════════════════════════╝
`));
  log.text(chalk.green('✨ 轻松管理多个Vite环境'));
  log.text(chalk.cyan('📦 并行测试、端口智能分配')); 
  log.text(chalk.magenta('🌐 代理规则、隔离环境'));
  log.br();
};