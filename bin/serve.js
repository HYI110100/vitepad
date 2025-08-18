#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import inquirer from 'inquirer'
import chalk from 'chalk'
import detect from 'detect-port'

const CONFIG_FILE = './env.config.json'
const PAGE_ROOT = 'dists'

// ================= 工具函数 =================
function deleteFolderRecursive(folderPath) {
  if (!fs.existsSync(folderPath)) return

  const files = fs.readdirSync(folderPath)
  for (const file of files) {
    const curPath = path.join(folderPath, file)
    if (fs.lstatSync(curPath).isDirectory()) {
      // 递归删除子目录
      deleteFolderRecursive(curPath)
    } else {
      // 删除文件
      fs.unlinkSync(curPath)
    }
  }
  fs.rmdirSync(folderPath)
}
function loadConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({}, null, 2))
  }
  return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'))
}
function saveConfig(cfg) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2))
}
function logInfo(msg) {
  console.log(chalk.cyan(`ℹ ${msg}`))
}
function logSuccess(msg) {
  console.log(chalk.green(`✅ ${msg}`))
}
function logWarn(msg) {
  console.log(chalk.yellow(`⚠ ${msg}`))
}
function logError(msg) {
  console.log(chalk.red(`❌ ${msg}`))
}

// ================= CLI 核心 =================
const [, , cmd, ...args] = process.argv
const cfg = loadConfig()

async function cmdList() {
  const keys = Object.keys(cfg)
  if (!keys.length) {
    logWarn('当前没有任何环境，请先运行 vserve add')
    return
  }

  console.log(chalk.bold('\n当前环境:'))
  keys.forEach(name => {
    const c = cfg[name]
    console.log(`  ${chalk.green(name)}  | 端口: ${c.port} | 根目录: ${c.root} | 代理数: ${Object.keys(c.proxies || {}).length}\n`)
  })
}

async function cmdAdd(name) {
  if (!name) {
    const ans = await inquirer.prompt([
      { type: 'input', name: 'envName', message: '环境名称:' }
    ])
    name = ans.envName
  }

  if (cfg[name]) {
    logError(`环境 ${name} 已存在`)
    return
  }

  const portAns = await inquirer.prompt([
    { type: 'input', name: 'port', message: '端口号(默认3000):', default: '3000' }
  ])
  let port = parseInt(portAns.port, 10) || 3000
  port = await detect(port)

  const rootAns = await inquirer.prompt([
    { type: 'input', name: 'root', message: '根目录(默认当前环境名称):', default: name }
  ])
  const root = `${PAGE_ROOT}/${rootAns.root}`

  let proxies = {}
  while (true) {
    const { prefix } = await inquirer.prompt([
      { type: 'input', name: 'prefix', message: '代理前缀(如 /api，直接回车结束):' }
    ])
    if (!prefix) break
    const { target } = await inquirer.prompt([
      { type: 'input', name: 'target', message: `代理目标(${prefix} ->):` }
    ])
    proxies[prefix] = target
    if (!target) break
  }

  cfg[name] = { port, root, proxies }
  saveConfig(cfg)
  logSuccess(`已添加环境 ${name}`)
  // 自动生成根目录：dists/<环境名>
  const fsRoot = path.join(PAGE_ROOT, name)
  if (!fs.existsSync(fsRoot)) {
    fs.mkdirSync(fsRoot, { recursive: true })
    // 从模板文件生成 index.html
    const templatePath = path.join('templates', 'index.html')
    const indexPath = path.join(fsRoot, 'index.html')

    let template = fs.readFileSync(templatePath, 'utf-8')
    template = template.replace(/<%= ENV_NAME %>/g, name) // 替换占位
    template = template.replace(/<%= PORT %>/g, port) // 替换占位
    fs.writeFileSync(indexPath, template, 'utf-8')

    logInfo(`默认页面以创建: ${indexPath}`)
  }
}

async function cmdRemove(name) {
  const keys = Object.keys(cfg)
  if (!keys.length) {
    logWarn('没有环境可删除')
    return
  }
  let target = name
  if (!target) {
    const ans = await inquirer.prompt([
      { type: 'checkbox', name: 'toDelete', message: '选择要删除的环境:', choices: keys }
    ])
    ans.toDelete.forEach(k => {
      deleteFolderRecursive(cfg[k].root)
      delete cfg[k]
    })
    saveConfig(cfg)
    logSuccess(`已删除: ${ans.toDelete.join(', ')}`)
    return
  }
  if (!cfg[target]) {
    logError(`环境 ${target} 不存在`)
    return
  }
  deleteFolderRecursive(cfg[target].root)
  delete cfg[target]
  saveConfig(cfg)
  logSuccess(`已删除环境 ${target}`)
}

async function cmdStart(name) {
  let target = name
  if (!target) {
    const ans = await inquirer.prompt([
      { type: 'list', name: 'env', message: '选择要启动的环境:', choices: Object.keys(cfg) }
    ])
    target = ans.env
  }
  if (!cfg[target]) {
    logError(`环境 ${target} 不存在`)
    return
  }
  const conf = cfg[target]
  const freePort = await detect(conf.port)
  if (freePort !== conf.port) {
    logWarn(`端口 ${conf.port} 被占用，改用 ${freePort}`)
    conf.port = freePort
  }
  saveConfig(cfg)

  logInfo(`启动环境 ${target} (端口:${conf.port}, 根目录:${conf.root})`)
  const child = spawn('vite', ['--mode', target, '--host', '0.0.0.0', '--port', conf.port], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      VITE_ENV_NAME: target
    }
  })
  child.on('exit', code => process.exit(code))
}

// ================= 入口 =================
switch (cmd) {
  case 'start':
  case 's':       // 缩写
    cmdStart(args[0])
    break
  case 'add':
  case 'a':       // 缩写
    cmdAdd(args[0])
    break
  case 'remove':
  case 'rm':      // 可给 remove 缩写
    cmdRemove(args[0])
    break
  case 'list':
  case 'ls':      // 给 list 缩写
    cmdList()
    break
  default:
    console.log(`
用法:
  vserve start|s [name]     启动环境
  vserve add|a [name]       添加环境
  vserve remove|rm [name]   删除环境
  vserve list|ls             查看环境
    `)
}
