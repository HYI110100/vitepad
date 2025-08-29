export interface ProxyOptions  {
    original: string;
    path: string;
    target: string;
    isExplicitPath: boolean;
}
export interface BaseCommand  {
    // TODO: 基础命令待做
    // debug?: boolean;
    // details?: boolean;
}
export interface CreateCommand extends BaseCommand {
    name: string            // 服务名称
    port?: number           // 网站端口，自增
    dir?: string            // 网站所在目录
    proxy?: ProxyOptions[]  // 多次命令格式 /api::http://api.example.com 自动解析格式
    viteConfig?: string
}
export interface ListCommand extends BaseCommand {
    detail?: boolean;       // 显示详细信息
    json?: boolean;         // 以JSON格式输出
}
export interface RemoveCommand extends BaseCommand {
    names: string[]         // 要移除的服务名称，如果不填写进入交互选择
    all?: boolean;          // 不询问，直接删除当前模式下的所有服务
}
export interface EditCommand extends BaseCommand {
    name: string            // 服务名称
    port?: number           // 网站端口，自增
    dir?: string            // 网站所在目录
    proxy?: ProxyOptions[]  // 多次命令格式 /api::http://api.example.com 自动解析格式
    append?: boolean        // 对 proxy 字段使用追加模式（默认覆盖）
    viteConfig?: string
}
export interface StartCommand extends BaseCommand {
    names: string[]         // 要启动的服务名称，如果不填写进入交互选择
    all?: boolean;          // 启动所有项目,优先级低于--name,如果有name不会生效
    update?:boolean
}
export interface StopCommand extends BaseCommand {
    names: string[]         // 要停止的服务名称，如果不填写进入交互选择
    all?: boolean;          // 不询问，直接停止所有服务
}