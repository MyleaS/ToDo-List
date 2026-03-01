import TodoForm from "../features/TodoForm";
import TodoList from "../features/TodoList/TodoList";
import TodosViewForm from "../features/TodosViewForm";

export default function TodosPage({
  todoList,
  isLoading,
  isSaving,
  errorMessage,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
  onAddTodo,
  onCompleteTodo,
  onUpdateTodo,
  onClearError,
}) {
  return (
    <>
      {isLoading && <p>Loading...</p>}

      <TodoForm onAddTodo={onAddTodo} isSaving={isSaving} />

      <TodoList
        todoList={todoList}
        isLoading={isLoading}
        onCompleteTodo={onCompleteTodo}
        onUpdateTodo={onUpdateTodo}
      />

      <TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString}
      />

      {errorMessage && (
        <div className="errorMessage">
          <hr />
          <p>{errorMessage}</p>
          <button onClick={onClearError}>Dismiss</button>
        </div>
      )}
    </>
  );
}
