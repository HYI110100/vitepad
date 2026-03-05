import path from 'path';
import os from 'os';
import fs from 'fs';
import { logger } from './logger.js';
/**
 * 获取默认根目录
 */
function getDefaultRootDir(rootFolderName: string): string {
    const platform = process.platform;
    
    if (platform === 'win32') {
        // Windows: C:\Users\username\AppData\Local\vitepad
        return path.join(os.homedir(), 'AppData', 'Local', rootFolderName);
    } else if (platform === 'darwin') {
        // macOS: ~/Library/Application Support/vitepad
        return path.join(os.homedir(), 'Library', 'Application Support', rootFolderName); 
    } else {
        // Linux: ~/.config/vitepad 或 ~/.vitepad
        return path.join(os.homedir(), '.config', rootFolderName);
    }
}

/**
 * 获取程序根目录
 */
export function getAppRootDir(rootFolderName: string): string {
    const isDev = process.env.NODE_ENV === 'development';
    
    if (isDev) {
        return path.join(process.cwd(), rootFolderName);
    }
    
    // 获取自定义目录
    let customDir = process.env.VITEPAD_ROOT_DIR;
    
    if (customDir?.trim()) {
        customDir = customDir.trim();
        
        // 处理波浪号 ~ 表示用户目录
        if (customDir.startsWith('~/') || customDir.startsWith('~\\')) {
            customDir = path.join(os.homedir(), customDir.slice(2));
        }
        
        // 如果不是绝对路径，相对于用户目录
        if (!path.isAbsolute(customDir)) {
            customDir = path.join(os.homedir(), customDir);
        }
        
        // 规范化路径
        customDir = path.normalize(customDir);
        
        // 自动创建目录
        try {
            fs.mkdirSync(customDir, { recursive: true });
        } catch (error) {
            logger.warn(`环境变量 VITEPAD_ROOT_DIR 无法创建目录，使用默认路径`,  `failed to create dir ${customDir}`);
            return getDefaultRootDir(rootFolderName);
        }
        
        return customDir;
    }
    
    return getDefaultRootDir(rootFolderName);
}
/**
 * 解析代理选项
 */
export function parseProxyOptions(proxyOptions: string[]): Record<string, string> {
  const proxy: Record<string, string> = {};
  proxyOptions.forEach(option => {
    const [path, target] = option.split('::');
    if (path && target) {
      proxy[path] = target;
    }
  });
  return proxy;
}

/**
 * 获取版本号
 */
export async function getVersion() {
  try {
    const { fileURLToPath } = await import('url');
    const { dirname, join } = await import('path');
    const { readFile } = await import('fs/promises');
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const packageJsonPath = join(__dirname, '..', '..', 'package.json');
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'));
    
    return packageJson.version;
  } catch (error) {
    return 'unknown';
  }
}