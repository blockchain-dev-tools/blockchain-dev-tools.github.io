# 开发规范文档

## 目录

- [代码规范](#代码规范)
- [Git 工作流](#git-工作流)
- [项目结构规范](#项目结构规范)
- [组件开发规范](#组件开发规范)
- [样式规范](#样式规范)
- [TypeScript 规范](#typescript-规范)
- [测试规范](#测试规范)
- [文档规范](#文档规范)
- [性能优化规范](#性能优化规范)
- [安全规范](#安全规范)
- [代码审查清单](#代码审查清单)

---

## 代码规范

### 基本原则

1. **可读性优先**：代码应该易于理解和维护
2. **一致性**：遵循项目现有的代码风格
3. **简洁性**：避免过度设计，保持代码简洁
4. **可测试性**：编写易于测试的代码

### 命名规范

#### 文件命名

```typescript
// ✅ 正确：组件文件使用 PascalCase
EvmTransactionDecoder.tsx
SolanaTransactionDecoder.tsx

// ✅ 正确：工具文件使用 kebab-case
use-mobile.ts
app-sidebar.tsx

// ✅ 正确：页面文件统一使用 page.tsx
page.tsx
layout.tsx

// ❌ 错误
evmTransactionDecoder.tsx  // 组件应使用 PascalCase
UseMobile.ts               // hooks 应使用 kebab-case
```

#### 变量和函数命名

```typescript
// ✅ 正确：变量使用 camelCase
const rawTransaction = '';
const isLoading = false;

// ✅ 正确：常量使用 UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.example.com';

// ✅ 正确：函数使用 camelCase，动词开头
function handleDecode() {}
function fetchTransactionData() {}
function isValidAddress() {}

// ✅ 正确：React 组件使用 PascalCase
function TransactionDecoder() {}
const UserProfile = () => {};

// ✅ 正确：自定义 Hook 以 use 开头
function useMobile() {}
function useTheme() {}

// ❌ 错误
const RawTransaction = '';  // 变量不应使用 PascalCase
function Decode() {}        // 函数应使用 camelCase
function use_mobile() {}    // Hook 应使用 camelCase
```

#### 类型和接口命名

```typescript
// ✅ 正确：接口使用 PascalCase
interface Transaction {
  hash: string;
  from: string;
  to: string;
}

// ✅ 正确：类型别名使用 PascalCase
type TransactionStatus = 'pending' | 'confirmed' | 'failed';

// ✅ 正确：泛型使用单个大写字母或 PascalCase
type Result<T> = { data: T; error: Error | null };
type ApiResponse<TData, TError> = { ... };

// ❌ 错误
interface transaction {}    // 应使用 PascalCase
type transactionStatus = ...  // 应使用 PascalCase
```

### 代码格式化

#### 缩进和空格

```typescript
// ✅ 正确：使用 2 空格缩进
function example() {
  if (condition) {
    return true;
  }
  return false;
}

// ✅ 正确：运算符两边加空格
const sum = a + b;
const isValid = value === expected;

// ✅ 正确：逗号后加空格
const arr = [1, 2, 3];
const obj = { a: 1, b: 2 };

// ❌ 错误
function example(){return true;}  // 缺少空格和换行
const sum=a+b;                    // 缺少空格
```

#### 行宽限制

```typescript
// ✅ 正确：单行不超过 100 字符，合理换行
const longFunctionCall = someFunction(
  parameter1,
  parameter2,
  parameter3
);

// ✅ 正确：链式调用合理换行
const result = data
  .filter(item => item.active)
  .map(item => item.value)
  .reduce((acc, val) => acc + val, 0);

// ❌ 错误：单行过长
const longFunctionCall = someFunction(parameter1, parameter2, parameter3, parameter4, parameter5, parameter6);
```

#### 引号使用

```typescript
// ✅ 正确：统一使用单引号
const message = 'Hello World';
import { Button } from '@/components/ui/button';

// ✅ 正确：模板字符串使用反引号
const greeting = `Hello, ${name}!`;

// ❌ 错误：混用单双引号
const message = "Hello World";  // 应使用单引号
```

### ESLint 配置

项目使用 ESLint 进行代码检查，配置文件：`eslint.config.mjs`

```bash
# 运行 Lint 检查
pnpm lint

# 自动修复可修复的问题
pnpm lint --fix
```

#### 关键规则

```javascript
// eslint.config.mjs
export default {
  rules: {
    // TypeScript 相关
    '@typescript-eslint/no-explicit-any': 'warn',  // 避免使用 any
    '@typescript-eslint/no-unused-vars': 'error',  // 禁止未使用的变量
    
    // React 相关
    'react-hooks/rules-of-hooks': 'error',         // Hooks 规则
    'react-hooks/exhaustive-deps': 'warn',         // useEffect 依赖
    
    // 代码质量
    'no-console': 'warn',                          // 警告 console（允许用于调试）
    'prefer-const': 'error',                       // 优先使用 const
  }
}
```

---

## Git 工作流

### 分支策略

```
main              # 主分支（生产环境）
├── develop       # 开发分支
│   ├── feature/evm-gas-calculator      # 功能分支
│   ├── feature/solana-token-viewer     # 功能分支
│   ├── fix/tx-decoder-bug              # 修复分支
│   └── refactor/component-structure    # 重构分支
```

### 分支命名规范

```bash
# 功能开发
feature/功能名称
feature/evm-abi-parser
feature/multi-language-support

# Bug 修复
fix/问题描述
fix/transaction-decode-error
fix/theme-toggle-bug

# 重构
refactor/重构内容
refactor/sidebar-navigation
refactor/api-structure

# 文档
docs/文档内容
docs/update-readme
docs/add-api-docs

# 性能优化
perf/优化内容
perf/lazy-loading
perf/image-optimization

# 样式调整
style/样式内容
style/button-spacing
style/dark-mode-colors
```

### 提交信息规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
<类型>(<范围>): <描述>

[可选的正文]

[可选的脚注]
```

#### 提交类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(evm): add gas calculator` |
| `fix` | Bug 修复 | `fix(decoder): handle null transaction` |
| `docs` | 文档变更 | `docs: update README` |
| `style` | 代码格式（不影响功能） | `style: format with prettier` |
| `refactor` | 重构 | `refactor(sidebar): simplify navigation` |
| `perf` | 性能优化 | `perf: lazy load large components` |
| `test` | 测试 | `test: add decoder unit tests` |
| `chore` | 构建/工具变更 | `chore: update dependencies` |
| `ci` | CI 配置 | `ci: add GitHub Actions workflow` |
| `revert` | 回滚 | `revert: feat(evm): add gas calculator` |

#### 提交示例

```bash
# ✅ 正确
feat(evm): add transaction gas calculator
fix(decoder): fix parsing error for EIP-4844 transactions
docs: update project structure documentation
refactor(components): extract common transaction display logic

# ✅ 正确：带正文
feat(wallet): add HD wallet support

Implement hierarchical deterministic wallet generation:
- Support BIP32 derivation paths
- Add multi-account generation
- Include address derivation for ETH and BTC

Closes #123

# ❌ 错误
update code          # 描述不清晰
Fix bug             # 缺少范围和详细信息
add new feature     # 不符合规范格式
```

### 工作流程

#### 1. 开始新功能

```bash
# 从 develop 分支创建新分支
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# 开发代码...

# 提交更改
git add .
git commit -m "feat(scope): add new feature"

# 推送到远程
git push origin feature/your-feature-name
```

#### 2. 创建 Pull Request

1. 在 GitHub 上创建 PR
2. 选择 `develop` 作为目标分支
3. 填写 PR 模板：
   - 功能描述
   - 变更内容
   - 测试说明
   - 截图（如有 UI 变更）

#### 3. 代码审查

- 至少一位团队成员审查
- 通过所有自动化检查（Lint、Build）
- 解决所有审查意见

#### 4. 合并

```bash
# 合并到 develop（使用 Squash and Merge）
# 在 GitHub 上操作

# 删除已合并的分支
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

#### 5. 发布到生产

```bash
# 从 develop 创建 release 分支
git checkout -b release/v1.0.0 develop

# 更新版本号
# 更新 CHANGELOG

# 合并到 main
git checkout main
git merge release/v1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags

# 合并回 develop
git checkout develop
git merge release/v1.0.0
git push origin develop
```

---

## 项目结构规范

### 目录组织原则

1. **按功能分组**：相关文件放在一起
2. **扁平化**：避免过深的嵌套
3. **可预测**：遵循 Next.js 约定

### 添加新页面

```bash
# 1. 创建页面目录
src/app/evm/gas-calculator/
├── page.tsx           # 页面入口

# 2. 创建业务组件（如果复杂）
src/components/
└── GasCalculator.tsx

# 3. 更新导航配置
src/components/app-sidebar.tsx
```

### 添加新组件

```typescript
// src/components/YourComponent.tsx

'use client';  // 如果需要客户端交互

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface YourComponentProps {
  // 定义 props 类型
  title: string;
  onSubmit?: () => void;
}

export default function YourComponent({ title, onSubmit }: YourComponentProps) {
  const [state, setState] = useState('');

  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
}
```

### 文件导入顺序

```typescript
// 1. React 和 Next.js 核心
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// 2. 第三方库
import { parseTransaction } from 'viem';
import { Button } from '@/components/ui/button';

// 3. 本地组件和工具
import { cn } from '@/lib/utils';
import YourComponent from '@/components/YourComponent';

// 4. 类型定义
import type { Transaction } from '@/types';

// 5. 样式和资源（如需要）
import './styles.css';
```

---

## 组件开发规范

### 组件结构

```typescript
// src/components/ExampleComponent.tsx

'use client';  // 如果组件需要客户端特性

// 1. 导入
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. 类型定义
interface ExampleComponentProps {
  title: string;
  subtitle?: string;
  onAction: (value: string) => void;
}

// 3. 辅助函数（如果简单）
const formatValue = (value: string): string => {
  return value.toUpperCase();
};

// 4. 主组件
export default function ExampleComponent({
  title,
  subtitle,
  onAction,
}: ExampleComponentProps) {
  // 4.1 状态和 Hooks
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 4.2 事件处理函数
  const handleSubmit = () => {
    setIsLoading(true);
    onAction(value);
    setIsLoading(false);
  };

  // 4.3 渲染
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      
      <Button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </Button>
    </div>
  );
}
```

### 组件设计原则

#### 1. 单一职责

```typescript
// ✅ 正确：每个组件只负责一件事
function TransactionInput({ value, onChange }) {
  return <Textarea value={value} onChange={onChange} />;
}

function TransactionDisplay({ transaction }) {
  return <ReactJson src={transaction} />;
}

// ❌ 错误：组件做了太多事情
function TransactionTool({ ... }) {
  // 包含输入、验证、解析、显示等所有逻辑
}
```

#### 2. Props 类型定义

```typescript
// ✅ 正确：明确的类型定义
interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  onClick: () => void;
}

function CustomButton({ label, variant = 'primary', disabled, onClick }: ButtonProps) {
  // ...
}

// ❌ 错误：没有类型定义
function CustomButton({ label, onClick }) {
  // ...
}
```

#### 3. 状态管理

```typescript
// ✅ 正确：合理使用 useState
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // 每个状态独立管理
}

// ✅ 正确：相关状态可以组合
function Form() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  
  // 统一管理相关状态
}

// ❌ 错误：过度使用 useState
function Component() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  // ... 20 个 useState
  // 应该考虑使用 useReducer 或对象
}
```

#### 4. 副作用处理

```typescript
// ✅ 正确：合理使用 useEffect
function Component({ id }: { id: string }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData(id).then(setData);
  }, [id]);  // 明确依赖项

  return <div>{data?.name}</div>;
}

// ❌ 错误：缺少依赖项
function Component({ id }: { id: string }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData(id).then(setData);
  }, []);  // 应包含 id

  return <div>{data?.name}</div>;
}
```

### 组件导出

```typescript
// ✅ 正确：默认导出（页面组件、主要组件）
export default function TransactionDecoder() {
  // ...
}

// ✅ 正确：命名导出（工具组件、多个导出）
export function TransactionInput() { }
export function TransactionDisplay() { }

// ✅ 正确：类型也要导出
export type { TransactionDecoderProps };
```

---

## 样式规范

### Tailwind CSS 使用

#### 1. 类名组织

```typescript
// ✅ 正确：按功能分组，可读性好
<div className="
  flex items-center justify-between
  w-full max-w-4xl mx-auto
  p-4 rounded-lg
  bg-white dark:bg-gray-900
  border border-gray-200 dark:border-gray-700
">
  {children}
</div>

// ✅ 正确：使用 cn() 工具函数合并类名
import { cn } from '@/lib/utils';

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  className  // 允许外部传入类名
)}>
  {children}
</div>

// ❌ 错误：类名过长且难以阅读
<div className="flex items-center justify-between w-full max-w-4xl mx-auto p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
```

#### 2. 响应式设计

```typescript
// ✅ 正确：移动优先
<div className="
  w-full           {/* 默认全宽 */}
  md:w-1/2         {/* 中等屏幕 50% */}
  lg:w-1/3         {/* 大屏幕 33% */}
  p-4              {/* 默认内边距 */}
  md:p-6           {/* 中等屏幕更大内边距 */}
">
  {content}
</div>

// ✅ 正确：断点定义
sm: 640px   // 手机横屏
md: 768px   // 平板
lg: 1024px  // 桌面
xl: 1280px  // 大桌面
2xl: 1536px // 超大屏幕
```

#### 3. 深色模式

```typescript
// ✅ 正确：同时定义浅色和深色样式
<div className="
  bg-white dark:bg-gray-900
  text-gray-900 dark:text-gray-100
  border-gray-200 dark:border-gray-700
">
  {content}
</div>

// ✅ 正确：使用 CSS 变量（推荐）
<div className="
  bg-background
  text-foreground
  border-border
">
  {content}
</div>
```

#### 4. 自定义样式

```typescript
// ✅ 正确：复杂样式使用 CSS 模块或 globals.css
// globals.css
.gradient-background {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

// 组件中使用
<div className="gradient-background">
  {content}
</div>

// ❌ 错误：过度使用内联样式
<div style={{ background: 'linear-gradient(...)' }}>
  {content}
</div>
```

### 组件样式

```typescript
// ✅ 正确：可复用的样式变体
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input bg-background hover:bg-accent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// 使用
<button className={buttonVariants({ variant: 'outline', size: 'lg' })}>
  Click Me
</button>
```

---

## TypeScript 规范

### 类型定义

#### 1. 基本原则

```typescript
// ✅ 正确：明确的类型定义
function parseTransaction(raw: string): Transaction {
  // ...
}

// ✅ 正确：使用类型推断
const count = 0;  // 自动推断为 number
const items = [1, 2, 3];  // 自动推断为 number[]

// ❌ 错误：不必要的类型标注
const count: number = 0;  // 冗余
```

#### 2. 接口 vs 类型别名

```typescript
// ✅ 使用 interface 定义对象结构
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ interface 可以扩展
interface AdminUser extends User {
  permissions: string[];
}

// ✅ 使用 type 定义联合类型、交叉类型
type Status = 'pending' | 'confirmed' | 'failed';
type Result = Success | Error;

// ✅ 使用 type 定义函数类型
type Handler = (event: Event) => void;
```

#### 3. 泛型使用

```typescript
// ✅ 正确：使用泛型提高复用性
interface ApiResponse<T> {
  data: T;
  error: string | null;
  status: number;
}

function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  // ...
}

// 使用
const response = await fetchData<User>('/api/user');

// ✅ 正确：泛型约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

#### 4. 避免 any

```typescript
// ❌ 错误：使用 any
function process(data: any) {
  // 失去类型安全
}

// ✅ 正确：使用 unknown（如果类型未知）
function process(data: unknown) {
  if (typeof data === 'string') {
    // 类型守卫后可以安全使用
    console.log(data.toUpperCase());
  }
}

// ✅ 正确：使用泛型
function process<T>(data: T) {
  // 保持类型信息
}

// ⚠️ 特殊情况：第三方库类型不完整
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reactJson = data as any;
```

### React 组件类型

```typescript
// ✅ 正确：函数组件类型
import { FC, ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

// 方式 1：直接定义
function Card({ title, children, className }: CardProps) {
  // ...
}

// 方式 2：使用 FC（可选）
const Card: FC<CardProps> = ({ title, children, className }) => {
  // ...
};

// ✅ 正确：事件处理器类型
import { MouseEvent, ChangeEvent } from 'react';

function Component() {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    // ...
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // ...
  };

  return (
    <>
      <button onClick={handleClick}>Click</button>
      <input onChange={handleChange} />
    </>
  );
}
```

### 类型导出

```typescript
// ✅ 正确：导出公共类型
// types.ts
export interface Transaction {
  hash: string;
  from: string;
  to: string;
}

export type TransactionStatus = 'pending' | 'confirmed' | 'failed';

// 在其他文件中使用
import type { Transaction, TransactionStatus } from '@/types';
```

---

## 测试规范

### 测试策略

```
单元测试：测试独立函数和工具
├── 组件测试：测试 React 组件渲染和交互
├── 集成测试：测试多个组件协作
└── E2E 测试：测试完整用户流程
```

### 单元测试（待实现）

```typescript
// src/lib/__tests__/utils.test.ts
import { describe, it, expect } from '@jest/globals';
import { cn, formatAddress } from '../utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should handle conditional classes', () => {
      expect(cn('foo', false && 'bar')).toBe('foo');
    });
  });

  describe('formatAddress', () => {
    it('should format Ethereum address', () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678';
      expect(formatAddress(address)).toBe('0x1234...5678');
    });
  });
});
```

### 组件测试（待实现）

```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

### 测试覆盖率目标

- 工具函数：100%
- 组件：80% 以上
- 整体：70% 以上

---

## 文档规范

### 代码注释

```typescript
// ✅ 正确：为复杂逻辑添加注释
/**
 * Parse raw transaction hex string and recover sender address
 * @param rawTx - Raw transaction hex string (with or without 0x prefix)
 * @returns Parsed transaction object with recovered address
 * @throws {Error} If transaction format is invalid
 */
async function parseAndRecoverTransaction(rawTx: string): Promise<ParsedTransaction> {
  // Normalize hex string format
  const normalizedTx = rawTx.startsWith('0x') ? rawTx : `0x${rawTx}`;
  
  // Parse transaction using viem
  const parsed = parseTransaction(normalizedTx as `0x${string}`);
  
  // Recover sender address from signature
  const address = await recoverAddress({
    hash: parsed.hash,
    signature: { r: parsed.r!, s: parsed.s!, v: parsed.v! },
  });
  
  return { ...parsed, from: address };
}

// ❌ 错误：无用的注释
// This function parses transaction
function parseTransaction() {
  // Parse the transaction
  // ...
}
```

### README 要求

每个主要功能模块应包含：

1. **功能描述**：简要说明功能
2. **使用方法**：如何使用
3. **示例**：代码示例
4. **注意事项**：特殊说明

### 变更日志

使用 `CHANGELOG.md` 记录版本变更：

```markdown
# Changelog

## [1.1.0] - 2024-01-15

### Added
- EVM gas calculator feature
- Support for EIP-4844 transactions

### Fixed
- Transaction decoder error with null values
- Dark mode theme inconsistencies

### Changed
- Updated viem to v2.40.3
- Improved error messages

## [1.0.0] - 2024-01-01

### Added
- Initial release
- EVM transaction decoder
- Solana transaction decoder
- Mnemonic generator
```

---

## 性能优化规范

### 1. 代码分割

```typescript
// ✅ 正确：动态导入大型组件
import dynamic from 'next/dynamic';

const ReactJson = dynamic(() => import('react-json-view'), {
  ssr: false,  // 禁用服务端渲染
  loading: () => <div>Loading...</div>,  // 加载状态
});

// ✅ 正确：路由级别的代码分割（Next.js 自动处理）
// 每个 page.tsx 自动成为一个代码块
```

### 2. 图片优化

```typescript
// ✅ 正确：使用 Next.js Image 组件
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={180}
  height={38}
  priority  // 首屏图片使用 priority
/>

// ✅ 正确：非首屏图片自动懒加载
<Image
  src="/feature.png"
  alt="Feature"
  width={400}
  height={300}
  // 自动懒加载
/>
```

### 3. 状态更新优化

```typescript
// ✅ 正确：使用 useCallback 缓存函数
import { useCallback } from 'react';

function Component() {
  const handleClick = useCallback(() => {
    // 处理逻辑
  }, []);  // 依赖项为空，函数永不变化

  return <ChildComponent onClick={handleClick} />;
}

// ✅ 正确：使用 useMemo 缓存计算结果
import { useMemo } from 'react';

function Component({ items }) {
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.value - b.value);
  }, [items]);  // 只在 items 变化时重新计算

  return <List items={sortedItems} />;
}
```

### 4. 避免不必要的渲染

```typescript
// ✅ 正确：使用 React.memo 避免重复渲染
import { memo } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  // 只在 data 变化时重新渲染
  return <div>{/* 复杂渲染逻辑 */}</div>;
});

// ✅ 正确：合理拆分组件
function ParentComponent() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveComponent />  {/* 不会因为 count 变化而重新渲染 */}
    </>
  );
}
```

---

## 安全规范

### 1. 输入验证

```typescript
// ✅ 正确：验证用户输入
function parseTransaction(rawTx: string) {
  // 验证输入格式
  if (!rawTx || typeof rawTx !== 'string') {
    throw new Error('Invalid input: transaction must be a string');
  }

  // 验证十六进制格式
  const hexRegex = /^(0x)?[a-fA-F0-9]+$/;
  if (!hexRegex.test(rawTx)) {
    throw new Error('Invalid format: must be a hex string');
  }

  // 继续处理...
}
```

### 2. 敏感数据处理

```typescript
// ✅ 正确：不在客户端存储敏感数据
function MnemonicGenerator() {
  const [mnemonic, setMnemonic] = useState('');

  // ✅ 正确：明确警告用户
  return (
    <div>
      <div className="warning">
        ⚠️ Never share your mnemonic phrase. Store it securely offline.
      </div>
      
      {mnemonic && (
        <>
          <div>{mnemonic}</div>
          <button onClick={() => setMnemonic('')}>Clear</button>
        </>
      )}
    </div>
  );
}

// ❌ 错误：不要将助记词发送到服务器
// 不要记录敏感信息
console.log('Mnemonic:', mnemonic);  // ❌
```

### 3. 依赖安全

```bash
# 定期检查依赖漏洞
pnpm audit

# 更新有漏洞的依赖
pnpm update

# 锁定关键依赖版本
# package.json
{
  "dependencies": {
    "critical-package": "1.2.3"  // 不使用 ^ 或 ~
  }
}
```

### 4. XSS 防护

```typescript
// ✅ 正确：React 自动转义
function Component({ userInput }) {
  return <div>{userInput}</div>;  // 自动转义
}

// ⚠️ 谨慎：使用 dangerouslySetInnerHTML
function Component({ html }) {
  // 只在确保 HTML 安全时使用
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
}
```

---

## 代码审查清单

### 提交前自检

- [ ] 代码符合命名规范
- [ ] 代码格式化（运行 `pnpm lint`）
- [ ] 没有 console.log 和调试代码
- [ ] 类型定义完整
- [ ] 组件有适当的错误处理
- [ ] 添加了必要的注释
- [ ] 测试通过（如有）
- [ ] 构建成功（`pnpm build`）

### PR 审查清单

#### 代码质量

- [ ] 代码逻辑清晰，易于理解
- [ ] 没有重复代码
- [ ] 函数和组件职责单一
- [ ] 错误处理完善

#### 类型安全

- [ ] 没有使用 `any`（除非必要且有注释）
- [ ] Props 类型定义完整
- [ ] 函数返回值类型明确

#### 性能

- [ ] 没有不必要的重复渲染
- [ ] 大型组件使用动态导入
- [ ] 图片使用 Next.js Image 组件

#### UI/UX

- [ ] 响应式设计正常
- [ ] 深色模式适配
- [ ] 加载状态友好
- [ ] 错误提示清晰

#### 安全

- [ ] 输入验证完善
- [ ] 没有安全漏洞
- [ ] 敏感数据处理正确

#### 文档

- [ ] 复杂逻辑有注释
- [ ] README 更新（如需要）
- [ ] CHANGELOG 更新（如需要）

---

## 常见问题

### Q: 什么时候使用 'use client'？

A: 当组件使用以下特性时：
- useState, useEffect 等 Hooks
- 浏览器 API（window, document）
- 事件处理器（onClick, onChange）
- 第三方客户端库

### Q: 如何选择 interface 还是 type？

A: 
- 对象结构优先使用 `interface`
- 联合类型、交叉类型使用 `type`
- 函数类型使用 `type`
- 需要扩展时优先 `interface`

### Q: 如何组织大型组件？

A:
1. 将复杂逻辑提取为自定义 Hook
2. 将 UI 部分拆分为子组件
3. 将工具函数提取到单独文件
4. 使用组合模式而非继承

### Q: 如何处理异步操作？

A:
```typescript
async function handleSubmit() {
  setIsLoading(true);
  setError(null);

  try {
    const result = await someAsyncOperation();
    setData(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
}
```

---

## 工具推荐

### VSCode 扩展

- **ESLint**：代码检查
- **Prettier**：代码格式化
- **Tailwind CSS IntelliSense**：Tailwind 类名自动补全
- **TypeScript Error Translator**：TypeScript 错误翻译
- **Error Lens**：行内显示错误

### Chrome 扩展

- **React Developer Tools**：React 调试
- **Redux DevTools**：状态管理调试（如使用）

---

## 参考资源

- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [shadcn/ui 文档](https://ui.shadcn.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 更新日志

- 2024-01-15：初始版本
- 待补充...

---

**最后更新时间：** 2024-01-15

如有任何问题或建议，请在项目中提 Issue 讨论。

