# 兑换码运营管理手册

> 本手册指导如何生成、存储、发放和追踪兑换码，确保运营流程顺畅。

---

## 1. 生成兑换码

### 标准码（EVOLVE- 前缀）

用于正式售卖，每码价值 ¥199：

```bash
cd scripts
# 生成 100 个标准码
node generate-codes.js 100 ./redeem-codes.txt

# 生成 500 个标准码，自定义输出文件
node generate-codes.js 500 ./batch-2026-04.txt
```

### 内测码（BETA- 前缀）

用于种子用户内测，免费发放：

```bash
# 生成 15 个内测码
node generate-codes.js --prefix BETA- 15 ./beta-codes.txt

# 生成 CSV 格式（便于 Excel 管理）
node generate-codes.js --prefix BETA- --format csv 15 ./beta-codes.csv
```

### 自定义前缀

如需其他批次（如活动码、合作码）：

```bash
# 生成活动码
node generate-codes.js --prefix EVENT- 50 ./event-codes.txt
```

---

## 2. 码的存储与备份

### 建议存储方式

1. **主文件**：保存在 `scripts/` 目录下的文本/CSV 文件
2. **备份**：将生成的码文件同步到云盘或密码管理器
3. **不要**将码文件提交到 Git 仓库（已配置 `.gitignore`）

### 文件命名规范

```
{prefix}-{批次}-{日期}.{格式}
示例：
- EVOLVE-batch1-2026-04-24.txt
- BETA-seed-2026-04-24.csv
- EVENT-spring-2026-04-24.txt
```

---

## 3. 发放流程

### 一对一发放（推荐）

适用于内测和高端用户：

1. 从码文件中选取一个未发放的码
2. 在发放记录表中标记「已发放」并填写用户信息
3. 通过微信私聊发送兑换码 + 使用说明
4. 提醒用户：码只能使用一次，请妥善保存

### 批量发放

适用于活动或社群运营：

1. 提前生成足够数量的码
2. 按活动规则发放（先到先得、抽奖等）
3. 在用户领取后立即标记为「已发放」

### 使用说明模板

```
你的专属兑换码：{CODE}

⚠️ 兑换码只能使用一次，请妥善保存

使用方式：
1. 手机浏览器打开 chenshushi.com
2. 点击右下角「我的」
3. 找到「课程解锁」输入框
4. 粘贴兑换码，点击「解锁全部课程」

如有问题，请联系微信：chenstatement
```

---

## 4. 验证方法

### 用户端验证

用户在应用内输入兑换码后，前端会自动校验：
- 格式是否正确（前缀 + 8 位字符）
- 校验位是否匹配（前7位算法校验第8位）
- 如果校验失败，提示「兑换码无效」

### 运营端验证

如需手动验证一个码是否有效：

```bash
# 在 generate-codes.js 同目录下运行 node
node -e "
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function verify(code, prefix = 'EVOLVE-') {
  const normalized = code.trim().toUpperCase();
  if (!normalized.startsWith(prefix)) return false;
  const body = normalized.slice(prefix.length);
  if (body.length !== 8) return false;
  for (const ch of body) if (!CODE_CHARS.includes(ch)) return false;
  let sum = 0;
  for (let i = 0; i < 7; i++) sum += CODE_CHARS.indexOf(body[i]);
  return (sum % 32) === CODE_CHARS.indexOf(body[7]);
}
console.log(verify('EVOLVE-XXXXXXXX'));
"
```

---

## 5. 库存管理

### 总览表

| 批次 | 前缀 | 数量 | 生成时间 | 文件 | 已发放 | 已使用 | 剩余 |
|------|------|------|----------|------|--------|--------|------|
| 正式第一批 | EVOLVE- | 100 | 2026-04-24 | batch1.txt | 0 | 0 | 100 |
| 内测 | BETA- | 15 | 2026-04-24 | beta-codes.csv | 0 | 0 | 15 |

### 发放记录表（按批次）

**批次：BETA- 内测码**

| 序号 | 兑换码 | 发放时间 | 用户昵称 | 用户微信 | 状态 |
|------|--------|----------|----------|----------|------|
| 1 | | | | | 未发放 |
| 2 | | | | | 未发放 |
| ... | | | | | |

**状态说明**：
- `未发放`：码在库存中，未分配给任何用户
- `已发放`：已发给用户，但用户尚未兑换
- `已使用`：用户已成功兑换
- `已失效`：因异常原因标记为失效（如发错用户）

---

## 6. 安全建议

### 防止码泄露

1. **不要**在公开场合（如朋友圈、公众号文章）直接展示完整兑换码
2. **不要**将码文件存储在公开可访问的云盘链接中
3. 发放时采用「一对一私聊」而非「公开领取」

### 防止批量盗刷

1. 兑换码校验为纯前端，理论上可暴力尝试
2. 建议控制单一批次数量（不超过 1000 个）
3. 如发现有异常兑换行为，可通知用户更换码

### 异常处理

- **用户丢失兑换码**：从记录表中查询该用户对应的码，重新发送
- **用户输错码**：引导用户仔细核对（注意区分 0/O、1/I/L）
- **码被他人使用**：核实用户身份后，重新发放新码，旧码作废

---

## 7. 常用命令速查

| 需求 | 命令 |
|------|------|
| 生成100个正式码 | `node generate-codes.js 100` |
| 生成内测码 | `node generate-codes.js --prefix BETA- 15` |
| 生成CSV格式 | `node generate-codes.js --format csv 100` |
| 自定义前缀 | `node generate-codes.js --prefix EVENT- 50` |
| 自定义输出 | `node generate-codes.js 100 ./my-codes.txt` |

---

*文档最后更新：2026-04-24*
