import React from './core/React.js'

// function component
function Counter({ num }) {
  function handleClick() {
    console.log('click')
  }
  return (
    <>
      <div>counter: {num} </div>
      <button onClick={handleClick}>Click</button>
    </>
  )
}
// const App = React.createElement("div", { id: "app" }, "hi", "-mini react");
const App = (
  <div>
    app
    <Counter num={10} />
    <Counter num={120} />
  </div>
)

export default App
