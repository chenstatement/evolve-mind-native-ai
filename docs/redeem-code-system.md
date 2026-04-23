# 兑换码系统使用文档

## 概述

思维进化训练营采用前端算法验证的兑换码系统，无需后端服务器即可实现课程解锁功能。

## 兑换码格式

**标准格式：** `EVOLVE-XXXXXXXX`

- 前缀：`EVOLVE-`
- 主体：8位字母数字组合
- 示例：`EVOLVE-UZ7VG2G3`、`EVOLVE-QJK4N5QK`

## 字符集说明

为避免视觉混淆，兑换码使用精简字符集：

- **包含：** `A-Z` 中排除 `O`、`I`、`L` 的大写字母 + `2-9` 数字
- **排除：** `0`（易与O混淆）、`1`（易与I/L混淆）、`O`、`I`、`L`
- **总字符数：** 32个

完整字符表：`ABCDEFGHJKMNPQRSTUVWXYZ23456789`

## 校验机制

兑换码第8位为校验位，由前7位通过算法生成：

```
校验位 = (前7位字符在字符表中的索引之和) % 32
```

此机制可防止用户手误输入错误码（如输错一位），错误码的校验位不匹配，前端会直接拒绝。

## 批量生成兑换码

### 使用方法

在项目根目录执行：

```bash
node scripts/generate-codes.js [数量] [输出文件]
```

### 示例

```bash
# 生成100个兑换码，保存到默认文件 redeem-codes.txt
node scripts/generate-codes.js

# 生成500个兑换码
node scripts/generate-codes.js 500

# 生成1000个兑换码，保存到指定文件
node scripts/generate-codes.js 1000 ./campaign-2026-codes.txt
```

### 输出示例

```
正在生成 100 个兑换码...

✓ 全部 100 个兑换码验证通过: 是

样本（前10个）:
  1. EVOLVE-UZ7VG2G3
  2. EVOLVE-ZAG22BS5
  3. EVOLVE-QJK4N5QK
  4. EVOLVE-3M7FR7JY
  5. EVOLVE-E8SNJG5D
  6. EVOLVE-PZ8W57HS
  7. EVOLVE-HNGVC47B
  8. EVOLVE-UXEXGZ8Z
  9. EVOLVE-6RBVBXFZ
  10. EVOLVE-X3HBJPKU

✓ 已保存到: ./redeem-codes.txt
```

## 用户端使用

1. 打开应用，进入「我的」页面
2. 找到「课程解锁」区域
3. 输入兑换码（如 `EVOLVE-UZ7VG2G3`）
4. 点击「解锁全部课程」
5. 验证通过后，第2-10课全部解锁

## 容量说明

- 理论可生成有效兑换码数量：约 **3200万** 个（32^7）
- 实际使用建议：每次营销活动生成 100-10000 个即可
- 兑换码为一次性使用（一个码解锁一个设备），同一设备只需输入一次

## 测试码（可直接使用）

以下兑换码已验证有效，可用于测试：

```
EVOLVE-UZ7VG2G3
EVOLVE-ZAG22BS5
EVOLVE-QJK4N5QK
EVOLVE-3M7FR7JY
EVOLVE-E8SNJG5D
EVOLVE-PZ8W57HS
EVOLVE-HNGVC47B
EVOLVE-UXEXGZ8Z
EVOLVE-6RBVBXFZ
EVOLVE-X3HBJPKU
```

## 注意事项

1. **纯前端验证：** 兑换码验证完全在浏览器端完成，无需服务器
2. **设备级解锁：** 兑换状态保存在设备本地（localStorage），换设备需重新输入
3. **防破解：** 虽然前端代码可见，但逆向计算出有效码的难度极高（需穷举32^7种组合）
4. **旧码失效：** 原硬编码兑换码 `EVOLVE2026` 已失效，请使用新格式

## 文件位置

- 验证逻辑：`app/src/utils/storage.js`（`verifyRedeemCode` 函数）
- 生成脚本：`app/scripts/generate-codes.js`
- 使用文档：`app/docs/redeem-code-system.md`（本文档）
