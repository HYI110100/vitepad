// src/types/index.ts
export interface ServiceConfig {
  id: string;                    // 服务唯一标识
  name: string;                  // 服务名称
  port: number;                  // 服务端口
  distDir: string;               // 构建目录（项目构建产物目录，用于复制到隔离环境）
  workDir: string;               // 工作目录（隔离环境目录，用于运行服务）
  proxy: Record<string, string>; // 代理配置
  status: 'stopped' | 'running'; // 服务状态
  pid: number;                  // 进程 ID
  createdAt: string;            // 创建时间
  updatedAt: string;            // 更新时间
  // TODO:: 增加项目目录 projectDir 字段 【待开发】
  // 自感知项目信息，自动收集 打包目录、端口号、代理配置等
  // projectDir: string;           // 项目目录（项目源代码目录）
}

export interface AppData {
  services: Record<string, ServiceConfig>;
  config: {
    // 全局日志级别
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    // 默认服务端口起始值（动态分配端口时使用）
    defaultPortStart: number;
  };
}


export interface AppConfig {
    // 程序根目录
    rootDir: string;
    // 服务隔离环境根目录
    isolateRoot: string;
}