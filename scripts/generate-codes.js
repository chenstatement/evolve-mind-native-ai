// 批量生成兑换码脚本
// 用法: node generate-codes.js [数量] [输出文件]
// 示例: node generate-codes.js 100 ./codes.txt

import { writeFileSync } from 'fs';

const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_PREFIX = 'EVOLVE-';

function generateCode() {
  let body = '';
  for (let i = 0; i < 7; i++) {
    body += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }

  let sum = 0;
  for (let i = 0; i < 7; i++) {
    sum += CODE_CHARS.indexOf(body[i]);
  }
  const checksum = CODE_CHARS[sum % 32];
  return CODE_PREFIX + body + checksum;
}

function generateCodes(count) {
  const codes = [];
  const seen = new Set();

  while (codes.length < count) {
    const code = generateCode();
    if (!seen.has(code)) {
      seen.add(code);
      codes.push(code);
    }
  }

  return codes;
}

function verifyCode(code) {
  const normalized = code.trim().toUpperCase();
  if (!normalized.startsWith(CODE_PREFIX)) return false;

  const body = normalized.slice(CODE_PREFIX.length);
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
const count = parseInt(process.argv[2], 10) || 100;
const outputFile = process.argv[3] || './redeem-codes.txt';

console.log(`正在生成 ${count} 个兑换码...\n`);

const codes = generateCodes(count);

// 验证所有生成的码
const allValid = codes.every(verifyCode);
console.log(`✓ 全部 ${codes.length} 个兑换码验证通过: ${allValid ? '是' : '否'}`);

// 输出样本
console.log('\n样本（前10个）:');
codes.slice(0, 10).forEach((code, i) => {
  console.log(`  ${i + 1}. ${code}`);
});

// 写入文件
const content = codes.join('\n');
writeFileSync(outputFile, content);
console.log(`\n✓ 已保存到: ${outputFile}`);
console.log(`\n兑换码格式: EVOLVE-XXXXXXXX`);
console.log(`字符集: 大写字母(不含O,I,L) + 数字(不含0,1)`);
console.log(`校验方式: 前7位算法校验第8位，防止手误输入`);
