/**
 * 生成 PWA 图标脚本
 * 需要安装: npm install sharp
 * 运行: node scripts/generate-icons.js
 */

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const svgPath = path.join(__dirname, '../public/favicon.svg')
const outputDir = path.join(__dirname, '../public')

const sizes = [192, 512]

async function generateIcons() {
  try {
    // 读取 SVG
    const svgBuffer = fs.readFileSync(svgPath)
    
    // 生成不同尺寸的 PNG
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon-${size}.png`)
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath)
      
      console.log(`✓ 生成 ${outputPath}`)
    }
    
    console.log('✓ 所有图标生成完成！')
  } catch (error) {
    console.error('生成图标失败:', error.message)
    console.log('\n提示: 如果未安装 sharp，请运行: npm install -D sharp')
    process.exit(1)
  }
}

generateIcons()

