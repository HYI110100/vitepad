// snapshot.js - 简化兼容版本

// ---------- 统一使用动态导入 ----------
const dynamicImport = async (specifier) => {
  if (typeof require !== 'undefined') {
    // CommonJS
    return require(specifier);
  } else {
    // ES Module
    const mod = await import(specifier);
    return mod.default || mod;
  }
};

// 立即执行的主函数
(async () => {
  // 动态导入所有依赖
  const fs = await dynamicImport('fs');
  const path = await dynamicImport('path');
  const picomatch = await dynamicImport('picomatch');

  // ---------- defaults ----------
  const defaultConfig = {
    rootDir: process.cwd(),
    outputFile: 'snapshot/project_snapshot.md',
    deny: [
      'node_modules/**',
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

  // ---------- walker ----------
  function createWalker(cfg) {
    const matchers = cfg.deny.map((p) => picomatch(p, { dot: cfg.includeHidden }));
    const root = path.resolve(cfg.rootDir);

    function isDenied(relUnix) {
      return matchers.some((m) => m(relUnix));
    }

    function* walk(dir, baseRel = '') {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
        .filter((e) => cfg.includeHidden || !e.name.startsWith('.'))
        .sort((a, b) => a.name.localeCompare(b.name));

      for (const entry of entries) {
        const abs = path.join(dir, entry.name);
        const rel = path.join(baseRel, entry.name);
        const relUnix = rel.split(path.sep).join('/');

        if (isDenied(relUnix)) continue;

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
      const entries = fs.readdirSync(dir, { withFileTypes: true })
        .filter((e) => cfg.includeHidden || !e.name.startsWith('.'))
        .map((e) => ({ e, rel: path.join(baseRel, e.name) }))
        .filter(({ rel }) => !isDenied(rel.split(path.sep).join('/')))
        .sort((a, b) => {
          if (a.e.isDirectory() && !b.e.isDirectory()) return -1;
          if (!a.e.isDirectory() && b.e.isDirectory()) return 1;
          return a.e.name.localeCompare(b.e.name);
        });

      let out = '';
      entries.forEach(({ e, rel }, idx) => {
        const isLast = idx === entries.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        out += prefix + connector + e.name + '\n';
        if (e.isDirectory()) {
          out += renderTree(path.join(dir, e.name), rel, prefix + (isLast ? '    ' : '│   '));
        }
      });
      return out;
    }

    return { walk, renderTree, root };
  }

  // ---------- 主程序 ----------
  const cfg = loadConfig();

  if (!cfg.deny.includes(cfg.outputFile)) cfg.deny.push(cfg.outputFile);

  const { walk, renderTree, root } = createWalker(cfg);
  const outPath = path.join(root, cfg.outputFile);
  const ws = fs.createWriteStream(outPath, { encoding: 'utf-8' });

  ws.write(`# 🗂️ 目录结构\n\n`);
  ws.write('```\n');
  ws.write(renderTree(root));
  ws.write('```\n\n');

  ws.write(`# 📄 文件\n\n`);
  for (const file of walk(root)) {
    const lang = getLanguageFromExt(file.rel);
    ws.write(`## \`${file.rel}\`\n\n`);
    if (lang) ws.write(`**语言**: \`${lang}\`\n\n`);
    ws.write('```' + (lang || '') + '\n');
    ws.write(file.content.trimEnd() + '\n');
    ws.write('```\n\n');
  }

  const ts = new Date().toLocaleString('zh-CN', { hour12: false });
  ws.write(`项目根目录 > ✅ 此快照生成于 ${ts}\n`);

  ws.end(() => console.log(`✅ Snapshot written to ${cfg.outputFile}`));
})().catch(console.error);