function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        const isTextNode =
          typeof child === 'string' || typeof child === 'number'
        return isTextNode ? createTextNode(child) : child
      })
    }
  }
}

function createTextNode(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  }
}

function render(el, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [el]
    }
  }
  nextUnitOfWork = wipRoot
}

function update() {
  const currentFiber = wipFiber
  return () => {
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber
    }
    nextUnitOfWork = wipRoot
  }

}

let wipRoot = null
let currentRoot = null
let nextUnitOfWork = null
let deletions = []
let wipFiber = null
function workLoop(deadline) {
  let shouldYield = false
  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)

    if (wipRoot?.sibling && wipRoot?.sibling?.type === nextUnitOfWork?.type) {
      nextUnitOfWork = undefined
    }

    shouldYield = deadline.timeRemaining() < 1
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}

function commitRoot() {
  deletions.forEach(commitDeletion)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
  deletions = []
}

function commitDeletion(fiber) {
  if (fiber.dom) {
    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent
    }
    fiberParent.dom.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child)
  }
}

function commitWork(fiber) {
  if (!fiber) return
  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }
  if (fiber.effectTag === 'update') {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
  } else if (fiber.effectTag === 'placement') {
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom)
    }
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function updateProps(dom, nextProps, prevProps) {
  Object.keys(prevProps).forEach((key) => {
    if (key !== 'children') {
      if (!(key in nextProps)) {
        dom.removeAttribute(key)
      }
    }
  })

  Object.keys(nextProps).forEach((key) => {
    if (key !== 'children') {
      if (nextProps[key] !== prevProps[key]) {
        if (key.startsWith('on')) {
          const functionType = key.slice(2).toLowerCase()
          dom.removeEventListener(functionType, prevProps[key])
          dom.addEventListener(functionType, nextProps[key])
        } else {
          dom[key] = nextProps[key]
        }
      }
    }
  })
}

function createDom(type) {
  return type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(type)
}

// 1. create a fiber object
// 2. create child fiber object
// 3. return next work unit
function reconcileChildren(fiber) {
  let prevChild = null
  let oldFiber = fiber.alternate?.child
  fiber.props.children.flat(1).forEach((child, index) => {
    let newFiber
    const isSameType = oldFiber && oldFiber.type === child.type
    if (isSameType) {
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        alternate: oldFiber,
        effectTag: 'update'
      }
    } else {
      if (child) {
        newFiber = {
          type: child.type,
          props: child.props,
          child: null,
          parent: fiber,
          sibling: null,
          dom: null,
          effectTag: 'placement'
        }

      }
      if (oldFiber) {
        deletions.push(oldFiber)
      }

    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }


    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }
    if (newFiber) {
      prevChild = newFiber
    }

  })

  while (oldFiber) {
    deletions.push(oldFiber)
    oldFiber = oldFiber.sibling
  }
}

function updateFunctionComponent(fiber) {
  stateHooks = []
  stateHookIndex = 0
  wipFiber = fiber
  fiber.props.children = [fiber.type(fiber.props)]
  reconcileChildren(fiber)

}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    // 1. create dom
    const dom = (fiber.dom = createDom(fiber.type))
    // fiber.parent.dom.append(dom)
    // 2. handle props
    updateProps(dom, fiber.props, {})
  }

  // 3. set pointer
  reconcileChildren(fiber)
}
function performUnitOfWork(fiber) {
  const isFunctionComponent = typeof fiber.type === 'function'
  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent
  }
}

requestIdleCallback(workLoop)


let stateHooks
let stateHookIndex
function useState(initial) {
  let currentFiber = wipFiber
  const oldHook = currentFiber.alternate?.stateHooks[stateHookIndex]
  const stateHook = {
    state: oldHook ? oldHook.state : initial
  }

  stateHookIndex++
  stateHooks.push(stateHook)


  currentFiber.stateHooks = stateHooks

  function setState(action) {
    stateHook.state = action(stateHook.state)
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber

    }
    nextUnitOfWork = wipRoot
  }
  return [stateHook.state, setState]
}

const React = {
  update,
  useState,
  render,
  createElement
}

export default React
