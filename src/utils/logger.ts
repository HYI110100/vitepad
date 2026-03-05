import chalk from 'chalk';

// 基础日志函数
export const logger = {
  // 普通信息
  info: (message: string, detail?: string) => {
    console.log(chalk.blue('→'), message);
    if (detail) console.log(chalk.gray('  ' + detail));
  },
  
  // 成功
  success: (message: string, detail?: string) => {
    console.log(chalk.green('✓'), message);
    if (detail) console.log(chalk.gray('  ' + detail));
  },
  
  // 错误
  error: (message: string, detail?: string) => {
    console.log(chalk.red('✗'), chalk.red(message));
    if (detail) console.log(chalk.gray('  ' + detail));
  },
  
  // 警告
  warn: (message: string, detail?: string) => {
    console.log(chalk.yellow('!'), message);
    if (detail) console.log(chalk.gray('  ' + detail));
  },
  
  // 调试信息
  debug: (message: string, detail?: string) => {
    console.log(chalk.gray('›'), chalk.gray(message));
    if (detail) console.log(chalk.gray('  ' + detail));
  },
  
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
  logger.text(chalk.green('✨ 轻松管理多个Vite环境'));
  logger.text(chalk.cyan('📦 并行测试、端口智能分配')); 
  logger.text(chalk.magenta('🌐 代理规则、隔离环境'));
  logger.br();
  logger.text(chalk.gray('输入 vitepad --h 查看所有命令'));
  logger.br();
};