import React from './core/React.js'

let showBar = false

let count = 0
function Foo() {
  const [count, setCount] = React.useState(10)
  const [bar, setBar] = React.useState('')

  function handleClick() {
    setCount((c) => c + 1)
    setBar((s) => s + 'a')
  }
  return (
    <div>
      <div>{count}</div>
      <div>{bar}</div>
      <button onClick={handleClick}>add </button>
    </div>
  )
}

const App = (
  <div>
    mini react
    <Foo />
  </div>
)

export default App
