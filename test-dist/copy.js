import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径（ES Module 中需要这样处理）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 确保 dist 目录存在
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

// 复制 HTML 文件
try {
  const targetFile = path.join(__dirname, '..', 'dist', 'test-dist', 'index.html');
  const targetDir = path.dirname(targetFile);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.copyFileSync(
    path.join(__dirname, 'index.html'),
    targetFile
  );
  console.log('✅ HTML 文件复制成功！');
} catch (err) {
  console.error('❌ 复制失败:', err.message);
}