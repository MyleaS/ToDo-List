import TodoListItem from "./TodoListItem";
import "./TodosList.css";

function TodoList({ todoList, isLoading, onCompleteTodo, onUpdateTodo }) {
  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);

  return (
    <div>
      {isLoading ? (
        <p className="loading">Todo list loading...</p>
      ) : filteredTodoList.length === 0 ? (
        <p>Add todo above to get started</p>
      ) : (
        <ul className="list">
          {filteredTodoList.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;
