import { join, resolve } from "path";
import fse from "fs-extra";
import { homedir } from "os";
import { ProxyItem } from "~/types/storage";

/**
 * 判断是否开发环境
 */
function isDevRuntime(): boolean {
  try {
    // dist/bin => dist
    const distDir = resolve(__dirname, "..");
    // 仓库开发场景：dist 同级存在 src 或项目根有 tsconfig.json
    const repoSrc = resolve(distDir, "../src");
    const repoTsconfig = resolve(distDir, "../tsconfig.json");
    return fse.existsSync(repoSrc) || fse.existsSync(repoTsconfig);
  } catch {
    return false;
  }
}

/**
 * 获取配置存放的完整路径
 */
export function getRootDir(path?: string): string {
  // WHY: 为什么获取不到环境变量啊？只能先判断目录了
  // "scripts" cross-env NODE_ENV=development
  // console.log(process.env.NODE_ENV); -> undefined
  const ROOT_DIR_NAME = ".vitepad"
  if (isDevRuntime()) {
    // 本地安装或开发模式
    return join(process.cwd(), ROOT_DIR_NAME, path || "");
  }

  // 全局安装，使用用户目录
  return join(homedir(), ROOT_DIR_NAME, path || "");
}
/**
 * 生成一个随机的 UUID
 * @param {number} [length=8] - UUID 的长度，默认为 8
 * @param {string} [prefix=''] - UUID 的前缀，默认为空字符串
 * @returns {string} 生成的 UUID
 */
export function uuid(length: number = 8, prefix: string = ''): string {
  const uuid = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  return prefix + uuid.substring(0, length);
}
/**
 * 获取一个合法的可用端口（仅检查配置冲突）
 * @param currentPort 当前建议的端口
 * @param usedPorts 已使用的端口数组
 * @param portRange 端口范围 [min, max]，默认 [3000, 10000]
 * @returns number 可用的端口号，如果没找到返回 -1
 */
export function findAvailablePort(
  currentPort: number,
  usedPorts: number[] = [],
  portRange: [number, number] = [3000, 10000]
) {
  const [min, max] = portRange
  if (currentPort < min || currentPort > max) {
    throw `端口号必须在 ${min} - ${max} 范围内`
  }
  let newPort = currentPort
  if (usedPorts.includes(newPort)) {
    // TODO: 如果超过max怎么处理
    newPort = findMinFreePortBinary(usedPorts, min)
  }
  return newPort
}
/**
 * 寻找最小未被占用的端口
 * @param {number[]} usedPorts - 已被占用的端口数组
 * @param {number} [start=3000] - 起始搜索端口，默认为3000
 * @returns {number} 第一个可用的端口号
 */
const findMinFreePortBinary = (usedPorts: number[], start = 3000) => {
  // 参数验证
  if (!Array.isArray(usedPorts)) {
    throw 'usedPorts 必须是一个数组'
  }
  if (typeof start !== 'number' || start < 0) {
    throw 'start 必须是非负数'
  }
  if (usedPorts.length === 0) {
    return start;
  }
  // 去重、过滤无效端口和小于起始端口的端口，然后排序
  const sortedPorts = [...new Set(usedPorts)]
    .filter(port => typeof port === 'number' && port >= 0 && port >= start)
    .sort((a, b) => a - b);

  let left = 0;
  let right = sortedPorts.length;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const expectedPort = start + mid;
    const actualPort = sortedPorts[mid];

    if (expectedPort === actualPort) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return start + left;
}

/**
 * 解析规则格式
 */
export function collectAndParseTarget(value: string) {
  let targetObj: ProxyItem;
  
  const [path, host] = value.split("::", 2);
  targetObj = {
    id: uuid(8, 'p_'),
    original: value,
    path: path || "",
    target: host || "",
    isExplicitPath: !!host,
  }

  return targetObj
}