import { join } from "path";

/**
 * 获取当前 CLI 版本号
 */
export function getVersion(): string {
  try {
    const packagePath = join(__dirname, "..", "..", "package.json");
    const version = require(packagePath).version;
    return version;
  } catch {
    return "0.0.0";
  }
}