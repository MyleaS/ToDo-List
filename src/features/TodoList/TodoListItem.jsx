import { useState, useEffect } from "react";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  // Edge case: reset workingTitle if todo.title changes
  useEffect(() => {
    setWorkingTitle(todo.title);
  }, [todo]); // runs whenever todo changes

  function handleUpdate(event) {
    if (!isEditing) return;

    event.preventDefault();

    onUpdateTodo({
      ...todo,
      title: workingTitle,
    });

    setIsEditing(false);
  }

  return (
    <li>
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <input
            value={workingTitle}
            onChange={(e) => setWorkingTitle(e.target.value)}
          />

          <button
            type="button"
            onClick={() => {
              setWorkingTitle(todo.title);
              setIsEditing(false);
            }}
          >
            Cancel
          </button>

          <button type="button" onClick={handleUpdate}>
            Update
          </button>
        </form>
      ) : (
        <>
          <span>{todo.title}</span>
          <button onClick={() => onCompleteTodo(todo.id)}>Complete</button>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      )}
    </li>
  );
}

export default TodoListItem;
