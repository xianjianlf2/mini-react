import { defineConfig } from 'vite'

// This project is a hand-written *mini* React — not the real one — so we do NOT
// use @vitejs/plugin-react. Instead we point esbuild's classic JSX transform at
// our own factory: `<div/>` compiles to `React.createElement('div', ...)`, where
// `React` is the default export imported from ./core/React.js.
//
// Vite/esbuild already defaults jsxFactory to `React.createElement`, but we set
// it explicitly so the wiring is obvious and doesn't depend on that default.
export default defineConfig({
  esbuild: {
    jsxFactory: 'React.createElement'
  },
  test: {
    environment: 'jsdom'
  }
})
