#!/usr/bin/env node
// 生产构建验证脚本
// 用法: node scripts/verify-build.js

import { existsSync, statSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'

const DIST_DIR = './dist'
let errors = 0
let warnings = 0

function logPass(msg) {
  console.log(`  \u2713 ${msg}`)
}

function logFail(msg) {
  console.log(`  \u2717 ${msg}`)
  errors++
}

function logWarn(msg) {
  console.log(`  \u26a0 ${msg}`)
  warnings++
}

console.log('\n══════════════════════════════════════════════')
console.log('  Build Verification')
console.log('══════════════════════════════════════════════\n')

// 1. Check dist folder exists
if (!existsSync(DIST_DIR)) {
  logFail('dist/ folder does not exist')
  process.exit(1)
}
logPass('dist/ folder exists')

// 2. Check index.html exists
const indexPath = join(DIST_DIR, 'index.html')
if (!existsSync(indexPath)) {
  logFail('dist/index.html does not exist')
} else {
  logPass('dist/index.html exists')
}

// 3. Check hashed filenames
const files = readdirSync(DIST_DIR, { recursive: true })
const jsFiles = files.filter(f => f.endsWith('.js'))
const cssFiles = files.filter(f => f.endsWith('.css'))

const hashedPattern = /\.[a-f0-9]{8,}\./
const jsHasHashed = jsFiles.some(f => hashedPattern.test(f))
const cssHasHashed = cssFiles.some(f => hashedPattern.test(f))

if (jsHasHashed) {
  logPass('JS files have content hashes')
} else {
  logWarn('JS files missing content hashes')
}

if (cssHasHashed) {
  logPass('CSS files have content hashes')
} else {
  logWarn('CSS files missing content hashes')
}

// 4. Check compressed files exist
const gzFiles = files.filter(f => f.endsWith('.gz'))
const brFiles = files.filter(f => f.endsWith('.br'))

if (gzFiles.length > 0) {
  logPass(`Gzip files present (${gzFiles.length})`)
} else {
  logWarn('No gzip files found')
}

if (brFiles.length > 0) {
  logPass(`Brotli files present (${brFiles.length})`)
} else {
  logWarn('No brotli files found')
}

// 5. Check total bundle size
let totalSize = 0
function getDirSize(dir) {
  const items = readdirSync(dir, { withFileTypes: true })
  for (const item of items) {
    const path = join(dir, item.name)
    if (item.isDirectory()) {
      getDirSize(path)
    } else {
      totalSize += statSync(path).size
    }
  }
}
getDirSize(DIST_DIR)
const totalSizeKB = (totalSize / 1024).toFixed(1)

if (totalSize > 500 * 1024) {
  logWarn(`Total bundle size: ${totalSizeKB} KB (exceeds 500KB threshold)`)
} else {
  logPass(`Total bundle size: ${totalSizeKB} KB (under 500KB threshold)`)
}

// 6. Check for source map references in production
if (existsSync(indexPath)) {
  const indexContent = readFileSync(indexPath, 'utf-8')
  if (indexContent.includes('sourceMappingURL')) {
    logWarn('index.html contains source map references')
  } else {
    logPass('No source map references in index.html')
  }
}

// 7. Check for console.log in built JS (spot check)
const builtJsFiles = files.filter(f => f.endsWith('.js') && !f.endsWith('.gz') && !f.endsWith('.br'))
let consoleLogFound = false
for (const jsFile of builtJsFiles.slice(0, 3)) {
  const content = readFileSync(join(DIST_DIR, jsFile), 'utf-8')
  if (content.includes('console.log') || content.includes('console.debug')) {
    consoleLogFound = true
    break
  }
}

if (consoleLogFound) {
  logWarn('console.log/debug found in built JS files')
} else {
  logPass('No console.log/debug in sampled JS files')
}

// Summary
console.log('\n──────────────────────────────────────────────')
if (errors === 0 && warnings === 0) {
  console.log('  \u2713 All checks passed!')
  console.log('══════════════════════════════════════════════\n')
  process.exit(0)
} else if (errors === 0) {
  console.log(`  \u26a0 ${warnings} warning(s), 0 errors`)
  console.log('══════════════════════════════════════════════\n')
  process.exit(0)
} else {
  console.log(`  \u2717 ${errors} error(s), ${warnings} warning(s)`)
  console.log('══════════════════════════════════════════════\n')
  process.exit(1)
}
