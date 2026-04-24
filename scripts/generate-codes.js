// 批量生成兑换码脚本
// 用法: node generate-codes.js [--prefix <PREFIX>] [--format csv|txt] [数量] [输出文件]
// 示例: node generate-codes.js 100 ./codes.txt
//        node generate-codes.js --prefix BETA- 15 ./beta-codes.txt
//        node generate-codes.js --prefix BETA- --format csv 15 ./beta-codes.csv

import { writeFileSync } from 'fs';

const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const DEFAULT_PREFIX = 'EVOLVE-';

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2);
  let prefix = DEFAULT_PREFIX;
  let count = 100;
  let outputFile = './redeem-codes.txt';
  let format = 'txt'; // txt | csv

  let i = 0;
  while (i < args.length) {
    if (args[i] === '--prefix') {
      prefix = args[i + 1];
      i += 2;
    } else if (args[i] === '--format') {
      format = args[i + 1];
      i += 2;
    } else if (/^\d+$/.test(args[i]) && count === 100) {
      count = parseInt(args[i], 10);
      i++;
    } else if (!/^(txt|csv)$/.test(args[i]) && args[i] !== '--prefix' && args[i] !== '--format') {
      outputFile = args[i];
      i++;
    } else {
      i++;
    }
  }

  return { prefix, count, outputFile, format };
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

function toCSV(codes, prefix) {
  const today = new Date().toISOString().split('T')[0];
  const header = '序号,兑换码,状态,生成时间,备注\n';
  const rows = codes.map((code, i) => `${i + 1},${code},未使用,${today},`).join('\n');
  return header + rows;
}

// 主程序
const { prefix, count, outputFile, format } = parseArgs();

console.log(`正在生成 ${count} 个兑换码... (前缀: ${prefix}, 格式: ${format})\n`);

const codes = generateCodes(count, prefix);

// 验证所有生成的码
const allValid = codes.every(c => verifyCode(c, prefix));
console.log(`✓ 全部 ${codes.length} 个兑换码验证通过: ${allValid ? '是' : '否'}`);

// 输出样本
console.log('\n样本（前10个）:');
codes.slice(0, 10).forEach((code, i) => {
  console.log(`  ${i + 1}. ${code}`);
});

// 写入文件
const today = new Date().toISOString().split('T')[0];
let content;
if (format === 'csv') {
  content = toCSV(codes, prefix);
} else {
  const header = `# Prefix: ${prefix} | Count: ${count} | Generated: ${today}\n`;
  content = header + codes.join('\n');
}
writeFileSync(outputFile, content);
console.log(`\n✓ 已保存到: ${outputFile}`);
console.log(`\n兑换码格式: ${prefix}XXXXXXXX`);
console.log(`字符集: 大写字母(不含O,I,L) + 数字(不含0,1)`);
console.log(`校验方式: 前7位算法校验第8位，防止手误输入`);
