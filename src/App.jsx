import "./App.css";
import { useState } from "react";
import TodoList from "./TodoList";
import TodoForm from "./TodoForm";

function App() {
  const [newTodos, setTodos] = useState("newTodos");

  return (
    <>
      <h1>Todo List</h1>
      <p>{newTodos}</p>
      <TodoList />
      <TodoForm />
    </>
  );
}

export default App;
