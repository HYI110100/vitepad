import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONFIG_PATH = path.join(__dirname, 'env.config.json')

export default defineConfig(({ mode }) => {
  // 读取配置
  const envConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))
  const conf = envConfig[mode] || envConfig[Object.keys(envConfig)[0]] || {
    root: 'dists/default',
    port: 3000,
    proxies: {}
  }
  
  // 确保根目录存在
  const rootPath = path.resolve(conf.root)
  if (!fs.existsSync(rootPath)) {
    fs.mkdirSync(rootPath, { recursive: true })
    // 创建默认index.html
    const defaultHtml = `<html><body><h1>${mode} Server</h1></body></html>`
    fs.writeFileSync(path.join(rootPath, 'index.html'), defaultHtml)
  }

  // 生成代理配置
  const proxy = Object.entries(conf.proxies || {}).reduce((acc, [prefix, target]) => {
    acc[prefix] = {
      target,
      changeOrigin: true,
      rewrite: path => path.replace(new RegExp(`^${prefix}`), '')
    }
    return acc
  }, {})

  return {
    root: conf.root,
    server: {
      port: conf.port,
      host: '0.0.0.0',
      open: true,
      proxy,
      cors: true
    },
    preview: {
      port: conf.port
    }
  }
})