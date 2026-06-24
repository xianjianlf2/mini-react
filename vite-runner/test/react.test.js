// @vitest-environment jsdom
import { describe, test, expect, beforeAll } from 'vitest'

// core/React.js kicks off its work loop via requestIdleCallback at import time,
// which jsdom does not provide. Polyfill it BEFORE importing the module.
globalThis.requestIdleCallback = (cb) =>
  setTimeout(() => cb({ timeRemaining: () => 50 }), 0)

const { default: React } = await import('../core/React.js')

// The render/commit happens asynchronously across idle ticks; wait for it to drain.
const flush = (ms = 50) => new Promise((r) => setTimeout(r, ms))

describe('createElement (virtual DOM)', () => {
  test('wraps props and children', () => {
    const el = React.createElement('div', { id: 'x' }, 'a', 'b')
    expect(el.type).toBe('div')
    expect(el.props.id).toBe('x')
    expect(el.props.children).toHaveLength(2)
  })

  test('coerces string/number children into TEXT_ELEMENT nodes', () => {
    const el = React.createElement('p', null, 'hello', 42)
    expect(el.props.children.map((c) => c.type)).toEqual([
      'TEXT_ELEMENT',
      'TEXT_ELEMENT'
    ])
    expect(el.props.children[0].props.nodeValue).toBe('hello')
    expect(el.props.children[1].props.nodeValue).toBe(42)
  })

  test('keeps element children as-is', () => {
    const child = React.createElement('span', null, 'hi')
    const el = React.createElement('div', null, child)
    expect(el.props.children[0]).toBe(child)
    expect(el.props.children[0].type).toBe('span')
  })
})

describe('render (host components)', () => {
  test('mounts an element tree into the container', async () => {
    const container = document.createElement('div')
    React.render(
      React.createElement('div', { id: 'root-node' }, 'hello'),
      container
    )
    await flush()
    const node = container.querySelector('#root-node')
    expect(node).not.toBeNull()
    expect(node.textContent).toBe('hello')
  })
})

describe('render (function components + useState)', () => {
  test('renders a function component with its initial hook state', async () => {
    function Counter() {
      const [count] = React.useState(7)
      return React.createElement('span', { id: 'count' }, count)
    }
    const container = document.createElement('div')
    React.render(React.createElement(Counter, null), container)
    await flush()
    expect(container.querySelector('#count')?.textContent).toBe('7')
  })
})
