// snapshot.js - 修复目录树显示版本

// ---------- 统一使用动态导入 ----------
const dynamicImport = async (specifier) => {
  if (typeof require !== 'undefined') {
    return require(specifier);
  } else {
    const mod = await import(specifier);
    return mod.default || mod;
  }
};

// ---------- 修复的 glob 匹配替代方案 ----------
function createMiniMatcher(pattern) {
  // 将模式转换为正则表达式
  let regexStr = pattern
    // 转义正则特殊字符，除了 * ? {
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    // 将 ** 替换为匹配任意字符（包括路径分隔符）
    .replace(/\*\*/g, '___DOUBLE_STAR___')
    // 将 * 替换为匹配除路径分隔符外的任意字符
    .replace(/\*/g, '[^/]*')
    // 将 ? 替换为单个除路径分隔符外的字符
    .replace(/\?/g, '[^/]')
    // 恢复 ** 为匹配任意字符
    .replace(/___DOUBLE_STAR___/g, '.*');

  // 确保匹配整个字符串
  if (!pattern.includes('/') || pattern.startsWith('**')) {
    // 对于不包含路径分隔符的模式，匹配任意层级
    regexStr = '^(.*/)?' + regexStr + '$';
  } else {
    regexStr = '^' + regexStr + '$';
  }

  return new RegExp(regexStr);
}

// ---------- 增强的路径匹配函数 ----------
function isPathDenied(relUnix, matchers) {
  // 如果路径为空，不排除
  if (!relUnix) return false;
  
  return matchers.some((matcher) => {
    // 直接匹配完整路径
    if (matcher.test(relUnix)) {
      return true;
    }
    
    // 对于目录模式，检查是否匹配路径的任何部分
    const parts = relUnix.split('/');
    for (let i = 0; i < parts.length; i++) {
      const partialPath = parts.slice(0, i + 1).join('/');
      if (matcher.test(partialPath)) {
        return true;
      }
    }
    
    return false;
  });
}

// 立即执行的主函数
(async () => {
  // 动态导入所有依赖
  const fs = await dynamicImport('fs');
  const path = await dynamicImport('path');

  // ---------- defaults ----------
  const defaultConfig = {
    rootDir: process.cwd(),
    outputFile: 'snapshot/project_snapshot.md',
    deny: [
      'node_modules',
      'node_modules/**',
      'dist',
      'dist/**',
      'build/**',
      '.next/**',
      'out/**',
      '.git/**',
      '.turbo/**',
      '.cache/**',
      '.vite/**',
      '.pnpm-store/**',
      '.DS_Store',
      '*.log',
      '*.lock',
      'coverage/**',
      '.idea/**',
      '.vscode/**',
      'LICENSE',
      'snapshot',
      'snapshot/**'
    ],
    includeHidden: false,
    maxFileSizeBytes: 1024 * 1024 * 5,
    textExtensions: [
      '.js', '.ts', '.tsx', '.jsx', '.mjs', '.cjs',
      '.json', '.md', '.markdown', '.txt', '.csv',
      '.html', '.htm', '.css', '.scss', '.less',
      '.yml', '.yaml', '.toml', '.ini', '.cfg',
      '.env', '.env.example', '.gitignore', '.gitattributes',
      '.vue', '.svelte', '.py', '.java', '.kt', '.rb', '.go', '.rs',
      '.sh', '.bash', '.zsh', '.ps1', '.bat', '.sql'
    ]
  };

  // ---------- load config ----------
  function loadConfig() {
    const rcPath = path.join(process.cwd(), '.snapshotrc.json');
    if (fs.existsSync(rcPath)) {
      try {
        const user = JSON.parse(fs.readFileSync(rcPath, 'utf-8'));
        return {
          ...defaultConfig,
          ...user,
          deny: [...defaultConfig.deny, ...(user.deny || [])]
        };
      } catch (e) {
        console.warn('⚠️  读取 .snapshotrc.json 失败，使用默认配置。', e.message);
      }
    }
    return { ...defaultConfig };
  }

  // ---------- binary detector ----------
  function isProbablyBinary(buffer) {
    const len = Math.min(buffer.length, 8000);
    let suspicious = 0;
    for (let i = 0; i < len; i++) {
      const c = buffer[i];
      if (c === 0) return true;
      if (c === 9 || c === 10 || c === 13 || (c >= 32 && c <= 126)) continue;
      suspicious++;
    }
    return suspicious / len > 0.3;
  }

  // ---------- language mapping ----------
  const extToLang = {
    '.js': 'javascript', '.cjs': 'javascript', '.mjs': 'javascript',
    '.ts': 'typescript', '.tsx': 'typescript', '.jsx': 'jsx',
    '.json': 'json', '.md': 'markdown', '.markdown': 'markdown',
    '.html': 'html', '.htm': 'html', '.css': 'css', '.scss': 'scss',
    '.sass': 'scss', '.less': 'scss', '.yml': 'yaml', '.yaml': 'yaml',
    '.toml': 'toml', '.sh': 'bash', '.bash': 'bash', '.ps1': 'powershell',
    '.sql': 'sql', '.py': 'python', '.java': 'java', '.rb': 'ruby',
    '.go': 'go', '.rs': 'rust', '.vue': 'vue', '.svelte': 'svelte',
    '.c': 'c', '.cpp': 'cpp', '.h': 'cpp', '.hpp': 'cpp'
  };
  function getLanguageFromExt(filename) {
    return extToLang[path.extname(filename).toLowerCase()] || '';
  }

  // ---------- 修复的 walker ----------
  function createWalker(cfg) {
    const matchers = cfg.deny.map((p) => createMiniMatcher(p));

    function isDenied(relUnix) {
      return isPathDenied(relUnix, matchers);
    }

    function* walk(dir, baseRel = '') {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
        .filter((e) => cfg.includeHidden || !e.name.startsWith('.'))
        .sort((a, b) => a.name.localeCompare(b.name));

      for (const entry of entries) {
        const abs = path.join(dir, entry.name);
        const rel = path.join(baseRel, entry.name);
        const relUnix = rel.split(path.sep).join('/');

        if (isDenied(relUnix)) {
          continue;
        }

        if (entry.isDirectory()) {
          yield* walk(abs, rel);
        } else if (entry.isFile()) {
          const stat = fs.statSync(abs);
          if (stat.size > cfg.maxFileSizeBytes) continue;

          const buf = fs.readFileSync(abs);
          const ext = path.extname(entry.name).toLowerCase();
          const isBinary = isProbablyBinary(buf);
          if (isBinary && !cfg.textExtensions.includes(ext)) continue;

          yield { abs, rel: relUnix, content: buf.toString('utf-8') };
        }
      }
    }

    function renderTree(dir, baseRel = '', prefix = '') {
      // 读取目录条目
      const entries = fs.readdirSync(dir, { withFileTypes: true })
        .filter((e) => cfg.includeHidden || !e.name.startsWith('.'))
        .map((e) => ({ 
          e, 
          rel: path.join(baseRel, e.name),
          abs: path.join(dir, e.name)
        }))
        // 过滤被排除的条目
        .filter(({ rel }) => {
          const relUnix = rel.split(path.sep).join('/');
          return !isDenied(relUnix);
        })
        .sort((a, b) => {
          if (a.e.isDirectory() && !b.e.isDirectory()) return -1;
          if (!a.e.isDirectory() && b.e.isDirectory()) return 1;
          return a.e.name.localeCompare(b.e.name);
        });

      let out = '';
      
      entries.forEach(({ e, rel, abs }, idx) => {
        const isLast = idx === entries.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        out += prefix + connector + e.name + '\n';
        
        if (e.isDirectory()) {
          // 递归处理子目录
          out += renderTree(abs, rel, prefix + (isLast ? '    ' : '│   '));
        }
      });
      
      return out;
    }

    return { walk, renderTree };
  }

  // ---------- 主程序 ----------
  const cfg = loadConfig();

  if (!cfg.deny.includes(cfg.outputFile)) cfg.deny.push(cfg.outputFile);

  console.log('🔧 配置的排除模式:', cfg.deny);

  const { walk, renderTree } = createWalker(cfg);
  const outPath = path.join(cfg.rootDir, cfg.outputFile);
  
  // 确保输出目录存在
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const ws = fs.createWriteStream(outPath, { encoding: 'utf-8' });

  ws.write(`# 🗂️ 目录结构\n\n`);
  ws.write('```\n');
  const treeOutput = renderTree(cfg.rootDir);
  ws.write(treeOutput);
  ws.write('```\n\n');

  ws.write(`# 📄 文件\n\n`);
  let fileCount = 0;
  for (const file of walk(cfg.rootDir)) {
    fileCount++;
    const lang = getLanguageFromExt(file.rel);
    ws.write(`## \`${file.rel}\`\n\n`);
    if (lang) ws.write(`**语言**: \`${lang}\`\n\n`);
    ws.write('```' + (lang || '') + '\n');
    ws.write(file.content.trimEnd() + '\n');
    ws.write('```\n\n');
  }

  const ts = new Date().toLocaleString('zh-CN', { hour12: false });
  ws.write(`项目根目录 > ✅ 此快照生成于 ${ts}，共包含 ${fileCount} 个文件\n`);

  ws.end(() => console.log(`✅ Snapshot written to ${cfg.outputFile}`));
})().catch(console.error);