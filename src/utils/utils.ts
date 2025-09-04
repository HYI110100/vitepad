import { join, resolve } from "path";
import fse from "fs-extra";
import { homedir } from "os";

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