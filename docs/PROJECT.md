# 项目架构文档

## 项目概述

Blockchain Dev Tools 是一个基于 Next.js 的现代化区块链开发工具集合，旨在为区块链开发者提供便捷的开发辅助工具。项目采用模块化设计，支持多个区块链生态系统。

## 技术架构

### 前端架构

```
┌─────────────────────────────────────────────────────────┐
│                     用户界面层                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │  EVM UI  │  │  SOL UI  │  │ Wallet UI│               │
│  └──────────┘  └──────────┘  └──────────┘               │
└─────────────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────────┐
│                    组件层                                │
│  ┌────────────────┐  ┌────────────────┐                 │
│  │  UI Components │  │ Business Comps │                 │
│  │  (shadcn/ui)   │  │  (Decoders)    │                 │
│  └────────────────┘  └────────────────┘                 │
└─────────────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────────┐
│                    业务逻辑层                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │   viem   │  │ ethers.js│  │  Solana  │               │
│  │          │  │          │  │  web3.js │               │
│  └──────────┘  └──────────┘  └──────────┘               │
└─────────────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────────┐
│                    区块链网络层                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ Ethereum │  │  Solana  │  │  其他链  │               │
│  └──────────┘  └──────────┘  └──────────┘               │
└─────────────────────────────────────────────────────────┘
```

### 技术选型

#### 核心框架

1. **Next.js 16**
   - 采用 App Router 架构
   - 支持服务端渲染（SSR）和静态生成（SSG）
   - 路由基于文件系统
   - 使用 Turbopack 作为开发构建工具

2. **React 19**
   - 最新的 React 版本
   - 使用 React Server Components
   - 客户端组件使用 `'use client'` 指令

3. **TypeScript 5**
   - 严格模式启用
   - 路径别名配置 `@/*` 指向 `src/*`
   - 完整的类型安全保证

#### UI 框架

1. **Tailwind CSS 4**
   - 实用优先的 CSS 框架
   - 自定义主题配置
   - 支持深色模式

2. **shadcn/ui**
   - 可复用的 React 组件
   - 基于 Radix UI 构建
   - 完全可定制

3. **主题系统**
   - next-themes 实现主题切换
   - 支持系统主题自动检测
   - 深色/浅色模式

#### 区块链库

1. **EVM 生态**
   - `viem`：现代化的 EVM 交互库
   - `ethers.js`：以太坊钱包和签名
   - 支持交易解析、签名恢复等功能

2. **Solana 生态**
   - `@solana/web3.js`：Solana 区块链交互
   - `bs58`：Base58 编解码
   - 支持 VersionedTransaction 解析

3. **通用工具**
   - `bip39`：BIP39 助记词生成
   - 支持多种语言的助记词列表

## 目录结构详解

```
blockchain-dev-tools/
│
├── src/                          # 源代码目录
│   │
│   ├── app/                      # Next.js App Router
│   │   ├── (home)/              # 路由组：首页
│   │   │   └── page.tsx         # 主页面
│   │   │
│   │   ├── evm/                 # EVM 工具路由
│   │   │   └── tx-decoder/     # 交易解码器
│   │   │       └── page.tsx
│   │   │
│   │   ├── sol/                 # Solana 工具路由
│   │   │   └── tx-decoder/     # 交易解码器
│   │   │       └── page.tsx
│   │   │
│   │   ├── wallet/              # 钱包工具路由
│   │   │   └── mnemonic-generator/  # 助记词生成器
│   │   │       └── page.tsx
│   │   │
│   │   ├── layout.tsx           # 根布局文件
│   │   ├── globals.css          # 全局样式
│   │   └── favicon.ico          # 网站图标
│   │
│   ├── components/               # React 组件
│   │   │
│   │   ├── ui/                  # shadcn/ui 基础组件
│   │   │   ├── button.tsx       # 按钮组件
│   │   │   ├── card.tsx         # 卡片组件
│   │   │   ├── input.tsx        # 输入框组件
│   │   │   ├── textarea.tsx     # 文本域组件
│   │   │   ├── sidebar.tsx      # 侧边栏组件
│   │   │   └── ...              # 其他 UI 组件
│   │   │
│   │   ├── app-sidebar.tsx      # 应用侧边栏（包含导航配置）
│   │   ├── site-header.tsx      # 网站头部
│   │   ├── theme-provider.tsx   # 主题提供者
│   │   ├── mode-toggle.tsx      # 主题切换按钮
│   │   │
│   │   ├── EvmTransactionDecoder.tsx     # EVM 交易解码器组件
│   │   ├── SolanaTransactionDecoder.tsx  # Solana 交易解码器组件
│   │   ├── GetRawTransaction.tsx         # 获取原始交易组件
│   │   │
│   │   ├── nav-group.tsx        # 导航组
│   │   ├── nav-main.tsx         # 主导航
│   │   ├── nav-projects.tsx     # 项目导航
│   │   └── nav-user.tsx         # 用户导航
│   │
│   ├── config/                   # 配置文件
│   │   └── index.ts             # 主配置（basePath 等）
│   │
│   ├── hooks/                    # 自定义 React Hooks
│   │   └── use-mobile.ts        # 移动端检测 Hook
│   │
│   └── lib/                      # 工具库
│       └── utils.ts             # 工具函数（cn 等）
│
├── public/                       # 静态资源目录
│   ├── next.svg                 # Next.js 标志
│   ├── vercel.svg               # Vercel 标志
│   └── *.svg                    # 其他图标
│
├── docs/                         # 文档目录
│   ├── PROJECT.md               # 项目架构文档（本文件）
│   └── SPEC.md                  # 开发规范文档
│
├── node_modules/                 # 依赖包目录
│
├── package.json                  # 项目配置和依赖
├── pnpm-lock.yaml               # pnpm 锁文件
├── tsconfig.json                # TypeScript 配置
├── next.config.ts               # Next.js 配置
├── tailwind.config.ts           # Tailwind CSS 配置（如果存在）
├── postcss.config.mjs           # PostCSS 配置
├── eslint.config.mjs            # ESLint 配置
├── components.json              # shadcn/ui 配置
└── README.md                    # 项目说明文档
```

## 核心模块详解

### 1. 路由系统（App Router）

#### 路由结构

```
/                           # 首页
├── /wallet
│   └── /mnemonic-generator  # 助记词生成器
├── /evm
│   └── /tx-decoder          # EVM 交易解码器
└── /sol
    └── /tx-decoder          # Solana 交易解码器
```

#### 路由组织

- 使用 Next.js 13+ App Router
- 文件系统路由：每个 `page.tsx` 对应一个路由
- 路由组 `(home)`：用于组织路由但不影响 URL
- 嵌套布局：`layout.tsx` 提供共享布局

### 2. 组件系统

#### 组件分层

```
┌─────────────────────────────────────┐
│         页面组件（Pages）             │
│   - page.tsx 文件中的默认导出         │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│       业务组件（Business）            │
│   - EvmTransactionDecoder            │
│   - SolanaTransactionDecoder         │
│   - Wallet Generator                 │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│       布局组件（Layout）              │
│   - AppSidebar                       │
│   - SiteHeader                       │
│   - Navigation Components            │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│     基础组件（UI Components）         │
│   - Button, Card, Input, etc.        │
│   - shadcn/ui 组件库                 │
└─────────────────────────────────────┘
```

#### 组件设计原则

1. **职责单一**：每个组件只负责一个功能
2. **可复用性**：基础组件高度可复用
3. **类型安全**：全部使用 TypeScript 编写
4. **客户端/服务端分离**：明确标注 `'use client'`

### 3. 侧边栏导航系统

侧边栏配置在 `app-sidebar.tsx` 中：

```typescript
const data = {
  navMain: {
    name: "Common",      // 通用工具分组
    items: [...]
  },
  navEvm: {
    name: "EVM",         // EVM 工具分组
    items: [...]
  },
  navSol: {
    name: "SOL",         // Solana 工具分组
    items: [...]
  }
}
```

#### 导航结构

- **可折叠侧边栏**：使用 `collapsible="icon"` 模式
- **分组导航**：按区块链生态分类
- **图标支持**：使用 Lucide Icons
- **活动状态**：自动高亮当前页面

### 4. 主题系统

#### 实现方式

```typescript
// theme-provider.tsx
<ThemeProvider
  attribute="class"           // 使用 class 属性切换主题
  defaultTheme="system"       // 默认跟随系统
  enableSystem                // 启用系统主题检测
  disableTransitionOnChange   // 禁用切换时的过渡动画
>
```

#### 主题切换

- 使用 `next-themes` 库
- 支持三种模式：light、dark、system
- Tailwind CSS 的 `dark:` 变体自动应用

### 5. 工具模块

#### EVM 交易解码器

**技术实现：**

```typescript
// 使用 viem 库
import { parseTransaction, serializeTransaction, recoverAddress } from 'viem';

// 解析流程
1. 验证输入（十六进制格式）
2. 使用 parseTransaction 解析
3. 处理不同交易类型（Legacy, EIP-1559, EIP-4844）
4. 恢复发送者地址
5. 序列化并计算交易哈希
6. 格式化输出
```

**支持的交易类型：**
- Legacy（传统交易）
- EIP-2930（访问列表交易）
- EIP-1559（伦敦升级，动态费用）
- EIP-4844（Blob 交易）

#### Solana 交易解码器

**技术实现：**

```typescript
// 使用 @solana/web3.js
import { VersionedTransaction } from "@solana/web3.js";
import bs58 from "bs58";

// 解析流程
1. 检测编码格式（Base58 或 Base64）
2. 解码为 Buffer
3. 使用 VersionedTransaction.deserialize
4. 提取消息、签名、指令等信息
5. 格式化输出
```

**支持的特性：**
- VersionedTransaction（v0 和 Legacy）
- 地址查找表（Address Lookup Tables）
- 多签名
- 指令数据解析

#### 助记词生成器

**技术实现：**

```typescript
// 使用 bip39 和 ethers.js
import * as bip39 from 'bip39';
import { Wallet } from 'ethers';
import { keccak256 } from 'viem';

// 生成流程
1. 接收中文字符输入
2. 映射到 BIP39 中文词表
3. 生成熵（Entropy）
4. 可选 Salt 加密
5. 使用 keccak256 哈希处理
6. 生成助记词
7. 派生以太坊钱包地址
```

**安全特性：**
- BIP39 标准
- 可选 Salt 增强安全性
- Keccak256 哈希
- 前端生成，不上传服务器

## 数据流

### 典型的交易解码流程

```
用户输入原始交易
    ↓
验证输入格式
    ↓
解码交易数据
    ↓
解析交易字段
    ↓
恢复地址/验证签名
    ↓
格式化为 JSON
    ↓
使用 ReactJson 展示
```

### 助记词生成流程

```
用户输入中文字符
    ↓
映射到 BIP39 词表索引
    ↓
生成初始熵
    ↓
应用 keccak256 哈希
    ↓
可选：混合 Salt
    ↓
生成最终熵
    ↓
转换为助记词
    ↓
派生钱包地址
    ↓
展示结果
```

## 状态管理

项目目前采用 **本地状态管理**：

1. **React State**
   - 使用 `useState` 管理组件状态
   - 适合简单的表单和 UI 状态

2. **URL 状态**
   - 使用 Next.js 路由传递状态
   - 适合页面间的状态共享

3. **主题状态**
   - 使用 `next-themes` 管理
   - 持久化到 localStorage

**未来扩展：**
- 如需全局状态，可引入 Zustand 或 Jotai
- 服务端状态可使用 TanStack Query

## 样式系统

### Tailwind CSS 配置

```typescript
// globals.css 中定义 CSS 变量
:root {
  --background: ...;
  --foreground: ...;
  --primary: ...;
  // 其他颜色变量
}

.dark {
  --background: ...;
  --foreground: ...;
  // 深色主题变量
}
```

### shadcn/ui 主题

- 使用 CSS 变量定义主题颜色
- `components.json` 配置组件样式
- `lib/utils.ts` 提供 `cn()` 工具函数合并 className

## 性能优化

### 1. 代码分割

- **动态导入**：react-json-view 使用动态导入
  ```typescript
  const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });
  ```

- **路由级分割**：Next.js 自动按路由分割代码

### 2. 图片优化

- 使用 Next.js `<Image>` 组件
- 自动优化图片格式和大小
- 懒加载和占位符

### 3. 构建优化

- Turbopack：开发时更快的构建速度
- Tree Shaking：自动移除未使用的代码
- 压缩和混淆：生产构建自动应用

## 部署架构

### Vercel 部署（推荐）

```
GitHub Repository
    ↓
自动触发部署
    ↓
Vercel 构建
    ↓
边缘网络分发
    ↓
全球 CDN 加速
```

### 自托管部署

```bash
# 构建
pnpm build

# 启动（Node.js 服务器）
pnpm start
```

### Docker 部署（可选）

```dockerfile
# 待实现
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build
CMD ["pnpm", "start"]
```

## 扩展性设计

### 1. 添加新工具

```
1. 在 src/app 下创建新路由
   - 例如：src/app/evm/gas-calculator/page.tsx

2. 创建对应的业务组件
   - 例如：src/components/GasCalculator.tsx

3. 更新侧边栏配置
   - 在 app-sidebar.tsx 的 navEvm 中添加新项

4. 更新文档和测试
```

### 2. 支持新区块链

```
1. 安装对应的区块链 SDK
   - 例如：pnpm add @cosmjs/stargate

2. 创建新的路由分组
   - 例如：src/app/cosmos/

3. 实现业务组件
   - 例如：src/components/CosmosTransactionDecoder.tsx

4. 添加导航分组
   - 在 app-sidebar.tsx 中添加 navCosmos

5. 更新类型定义
```

### 3. 添加 API 接口

```typescript
// 在 src/app/api 下创建路由
// 例如：src/app/api/decode/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  // 处理逻辑
  return NextResponse.json({ result: ... });
}
```

## 配置文件说明

### package.json

- **scripts**：定义开发、构建、启动命令
- **dependencies**：运行时依赖
- **devDependencies**：开发时依赖

### tsconfig.json

- **compilerOptions**：TypeScript 编译选项
- **paths**：路径别名配置（@/* → src/*）
- **strict**：启用严格模式

### next.config.ts

- Next.js 配置
- basePath 配置（部署子路径）
- 图片、字体等资源配置

### eslint.config.mjs

- ESLint 规则配置
- 使用 Next.js 推荐配置
- 自定义规则扩展

### components.json

- shadcn/ui 配置
- 组件别名和路径
- 样式配置

## 开发工作流

### 1. 功能开发流程

```
需求分析 → 设计组件 → 实现代码 → 测试 → 代码审查 → 合并
```

### 2. 分支策略

```
main          # 主分支（生产）
├── develop   # 开发分支
│   ├── feature/xxx  # 功能分支
│   ├── fix/xxx      # 修复分支
│   └── refactor/xxx # 重构分支
```

### 3. 提交规范

```
feat: 新功能
fix: 修复
docs: 文档
style: 格式
refactor: 重构
test: 测试
chore: 构建/工具
```

## 安全考虑

### 1. 前端安全

- **输入验证**：所有用户输入都需验证
- **XSS 防护**：React 自动转义
- **敏感数据**：助记词等不上传服务器

### 2. 依赖安全

- 定期更新依赖
- 使用 `pnpm audit` 检查漏洞
- 锁定关键依赖版本

### 3. 区块链安全

- **交易解析**：只读操作，不涉及私钥
- **助记词生成**：完全客户端生成
- **警告提示**：明确安全警告

## 测试策略

### 1. 单元测试（待实现）

```typescript
// 使用 Jest + React Testing Library
import { render, screen } from '@testing-library/react';
import EvmTransactionDecoder from './EvmTransactionDecoder';

test('renders decoder', () => {
  render(<EvmTransactionDecoder />);
  // 断言
});
```

### 2. 集成测试（待实现）

```typescript
// 测试完整的解码流程
test('decodes EVM transaction correctly', async () => {
  // 模拟用户输入
  // 验证输出
});
```

### 3. E2E 测试（待实现）

```typescript
// 使用 Playwright
test('user can decode transaction', async ({ page }) => {
  await page.goto('/evm/tx-decoder');
  // 交互和断言
});
```

## 监控和日志

### 开发环境

- Console.log 调试
- React DevTools
- Network 面板

### 生产环境（待实现）

- Vercel Analytics
- Sentry 错误追踪
- 自定义日志系统

## 国际化（i18n）

当前状态：仅支持中文和部分英文

**未来计划：**
```typescript
// 使用 next-intl
import { useTranslations } from 'next-intl';

function Component() {
  const t = useTranslations('common');
  return <div>{t('title')}</div>;
}
```

## 总结

本项目采用现代化的技术栈和架构设计，具有良好的扩展性和维护性。通过模块化的设计，可以方便地添加新的区块链工具和功能。项目注重用户体验、代码质量和安全性，是一个优秀的开源区块链开发工具平台。

## 相关文档

- [开发规范文档](./SPEC.md)
- [README](../README.md)
- [Next.js 文档](https://nextjs.org/docs)
- [shadcn/ui 文档](https://ui.shadcn.com/)

