import "./App.css";
import TodoList from "./TodoList";
import TodoForm from "./TodoForm";
import { useState } from "react";

function App() {
  const [newTodos, setTodos] = useState("newTodos");
  return (
    <div>
      <TodoList />
      <p>{newTodos}</p>
      <TodoForm />
    </div>
  );
}

export default App;
