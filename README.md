# mini-react

A minimal React implemented from scratch to understand how it works under the hood — `createElement` & virtual DOM, the **fiber** architecture with an interruptible work loop, reconciliation (diff + commit), function components, and hooks (`useState` / `useEffect`).

> Part of my `mini-*` source-code learning series. Talk is cheap — read the code.

## What's inside

```
core/                 # earliest version: createElement + recursive render
vite-runner/          # full version, runnable with Vite + HMR
└── core/React.js     # fiber work loop, reconciliation, hooks
```

The complete implementation lives in [`vite-runner/core/React.js`](./vite-runner/core/React.js).

## Concepts covered

| Topic | Implementation |
|-------|----------------|
| `createElement` & virtual DOM | `createElement`, `createTextNode` |
| Fiber & interruptible work loop | `workLoop` + `requestIdleCallback`, `performUnitOfWork` |
| Reconciliation | `reconcileChildren` (effectTag: placement / update / deletion) |
| Commit phase | `commitRoot`, `commitWork`, `commitDeletion` |
| Function components | `updateFunctionComponent` |
| Hooks | `useState` (batched `setState`), `useEffect` (with cleanup) |

## Run

```bash
cd vite-runner
pnpm install
pnpm dev
```

For the bare-bones version, open the root `index.html` directly — no build step.

---

## `mini-*` 源码学习系列

手写主流框架 / 工具的最小可运行实现，每个仓库只追「核心主线」，不堆功能。

| 仓库 | 内容 |
| --- | --- |
| [mini-vue](https://github.com/xianjianlf2/mini-vue) | 手写 Vue3：响应式 / runtime / 编译器 |
| **mini-react**（本仓库） | 手写 React：Fiber / reconciliation / Hooks |
| [mini-koa](https://github.com/xianjianlf2/mini-koa) | 手写 Koa：中间件洋葱模型 / context |
| [mini-webpack](https://github.com/xianjianlf2/mini-webpack) | 手写 webpack：依赖图 / loader / plugin |
| [mini-compiler](https://github.com/xianjianlf2/mini-compiler) | 手写 the-super-tiny-compiler：词法 / 语法 / 转换 / 生成 |
| [ts-axios](https://github.com/xianjianlf2/ts-axios) | 手写 axios（TypeScript 版） |

> Talk is cheap. Read the code.
