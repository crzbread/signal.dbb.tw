import { defineConfig } from 'vitepress'
import { existsSync, readdirSync } from 'node:fs'
import { join, parse } from 'node:path'

const contentRoot = 'content'

function listMarkdownFiles(dir: string) {
  if (!existsSync(dir)) return []

  return readdirSync(dir)
    .filter((file) => file.endsWith('.md') && file !== 'index.md' && !file.includes('_deleted'))
    .sort((a, b) => b.localeCompare(a))
}

function buildDailySidebar() {
  return listMarkdownFiles(join(contentRoot, 'daily')).map((file) => ({
    text: parse(file).name,
    link: `/daily/${parse(file).name}`
  }))
}

export default defineConfig({
  title: 'Signal',
  description: '個人科技情報系統',
  cleanUrls: true,
  srcDir: 'content',
  vite: {
    server: {
      // 填入 ngrok 提供的網址，允許 Vite 伺服器接受來自該網址的請求
      allowedHosts: ['']
    }
  },
  themeConfig: {
    nav: [
      { text: '首頁', link: '/' },
      { text: '日報', link: '/daily/' }
    ],
    sidebar: [
      {
        text: '日報',
        collapsed: false,
        items: [
          { text: '日報首頁', link: '/daily/' },
          ...buildDailySidebar()
        ]
      }
    ],
    search: {
      provider: 'local'
    }
  }
})
