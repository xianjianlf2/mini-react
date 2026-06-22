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

## The `mini-*` series

[mini-vue](https://github.com/xianjianlf2/mini-vue) · [mini-koa](https://github.com/xianjianlf2/mini-koa) · [mini-webpack](https://github.com/xianjianlf2/mini-webpack) · [mini-complier](https://github.com/xianjianlf2/mini-complier) · [ts-axios](https://github.com/xianjianlf2/ts-axios)
