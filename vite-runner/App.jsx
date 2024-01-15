import React from "./core/React.js";

// function component
function Counter({ num }) {
  return <div>counter: {num} </div>;
}
// const App = React.createElement("div", { id: "app" }, "hi", "-mini react");
const App = (
  <div>
    app
    <Counter num={10} />
    <Counter num={120} />
  </div>
);

export default App;
