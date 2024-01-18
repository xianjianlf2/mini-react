import React from './core/React.js'

// if we declare var in the function component
// the state will be reset in the next render
let count = 0
function Counter({ num }) {
  function handleClick() {
    count++
    React.update()
  }
  return (
    <>
      <div>Number: {num} </div>
      <div>counter: {count} </div>
      <button onClick={handleClick}>Click</button>
    </>
  )
}
// const App = React.createElement("div", { id: "app" }, "hi", "-mini react");
const App = (
  <div>
    mini react
    <Counter num={10} />
    {/* <Counter num={120} /> */}
  </div>
)

export default App
