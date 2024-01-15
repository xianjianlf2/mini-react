function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        const isTextNode =
          typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
}

function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function render(el, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [el],
    },
  };
  root = nextUnitOfWork;
}

const React = {
  render,
  createElement,
};
let root = null;
let nextUnitOfWork = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  // purpose: render dom at once
  if (!nextUnitOfWork && root) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

function commitRoot() {
  commitWork(root.child);
  root = null;
}

function commitWork(fiber) {
  if (!fiber) return;
  //  find parent which has dom
  let fiberParent = fiber.parent;
  // Nested structure
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  // Functional components have no DOM elements
  if (fiber.dom) {
    fiberParent.dom.append(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key];
    }
  });
}

function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

// 1. create a fiber object
// 2. create child fiber object
// 3. return next work unit
function initChildren(fiber, children) {
  let prevChild = null;
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      parent: fiber,
      dom: null,
      sibling: null,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}
function performUnitOfWork(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";
  if (!isFunctionComponent) {
    if (!fiber.dom) {
      // 1. create dom
      const dom = (fiber.dom = createDom(fiber.type));

      // fiber.parent.dom.append(dom)
      // 2. handle props
      updateProps(dom, fiber.props);
    }
  }

  const children = isFunctionComponent
    ? [fiber.type(fiber.props)]
    : fiber.props.children;
  // 3. set pointer
  initChildren(fiber, children);
  // 4. return next unit of work

  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
}

requestIdleCallback(workLoop);

export default React;
