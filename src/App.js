import "./App.css";
import Sweeper from "./sweeper/Sweeper";

function App() {
  return (
    <div className="App">
      <Sweeper rows={10} cols={10} mines={50} />
    </div>
  );
}

export default App;
