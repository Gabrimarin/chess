import "./App.css";
import Table from "./components/Table";

function App() {
  const table = [
    ["p", "P", "P", "p", "p", "p", "p", "P"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];
  return (
    <div>
      <Table table={table} />
    </div>
  );
}

export default App;
