// 批量生成兑换码脚本
// 用法: node generate-codes.js [--prefix <PREFIX>] [数量] [输出文件]
// 示例: node generate-codes.js 100 ./codes.txt
//        node generate-codes.js --prefix BETA- 15 ./beta-codes.txt

import { writeFileSync } from 'fs';

const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const DEFAULT_PREFIX = 'EVOLVE-';

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2);
  let prefix = DEFAULT_PREFIX;
  let count = 100;
  let outputFile = './redeem-codes.txt';

  let i = 0;
  while (i < args.length) {
    if (args[i] === '--prefix') {
      prefix = args[i + 1];
      i += 2;
    } else if (!count && /^\d+$/.test(args[i])) {
      count = parseInt(args[i], 10);
      i++;
    } else if (!outputFile && !/^\d+$/.test(args[i]) && args[i] !== '--prefix') {
      outputFile = args[i];
      i++;
    } else {
      i++;
    }
  }

  // 位置参数处理：如果数量未设置但第一个非 --prefix 参数是数字
  const positional = args.filter(a => a !== '--prefix' && !args.includes(a, args.indexOf('--prefix') + 1));
  const numericArgs = positional.filter(a => /^\d+$/.test(a));
  const pathArgs = positional.filter(a => !/^\d+$/.test(a));

  if (numericArgs.length > 0 && !count) count = parseInt(numericArgs[0], 10);
  if (pathArgs.length > 0 && outputFile === './redeem-codes.txt') outputFile = pathArgs[0];

  return { prefix, count, outputFile };
}

function generateCode(prefix) {
  let body = '';
  for (let i = 0; i < 7; i++) {
    body += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }

  let sum = 0;
  for (let i = 0; i < 7; i++) {
    sum += CODE_CHARS.indexOf(body[i]);
  }
  const checksum = CODE_CHARS[sum % 32];
  return prefix + body + checksum;
}

function generateCodes(count, prefix) {
  const codes = [];
  const seen = new Set();

  while (codes.length < count) {
    const code = generateCode(prefix);
    if (!seen.has(code)) {
      seen.add(code);
      codes.push(code);
    }
  }

  return codes;
}

function verifyCode(code, prefix) {
  const normalized = code.trim().toUpperCase();
  if (!normalized.startsWith(prefix.toUpperCase())) return false;

  const body = normalized.slice(prefix.length);
  if (body.length !== 8) return false;

  for (const ch of body) {
    if (!CODE_CHARS.includes(ch)) return false;
  }

  let sum = 0;
  for (let i = 0; i < 7; i++) {
    sum += CODE_CHARS.indexOf(body[i]);
  }
  const checksum = sum % 32;
  return checksum === CODE_CHARS.indexOf(body[7]);
}

// 主程序
const { prefix, count, outputFile } = parseArgs();

console.log(`正在生成 ${count} 个兑换码... (前缀: ${prefix})\n`);

const codes = generateCodes(count, prefix);

// 验证所有生成的码
const allValid = codes.every(c => verifyCode(c, prefix));
console.log(`✓ 全部 ${codes.length} 个兑换码验证通过: ${allValid ? '是' : '否'}`);

// 输出样本
console.log('\n样本（前10个）:');
codes.slice(0, 10).forEach((code, i) => {
  console.log(`  ${i + 1}. ${code}`);
});

// 写入文件（带注释头）
const today = new Date().toISOString().split('T')[0];
const header = `# Prefix: ${prefix} | Count: ${count} | Generated: ${today}\n`;
const content = header + codes.join('\n');
writeFileSync(outputFile, content);
console.log(`\n✓ 已保存到: ${outputFile}`);
console.log(`\n兑换码格式: ${prefix}XXXXXXXX`);
console.log(`字符集: 大写字母(不含O,I,L) + 数字(不含0,1)`);
console.log(`校验方式: 前7位算法校验第8位，防止手误输入`);
