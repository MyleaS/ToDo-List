function TodoForm() {
  return (
    <form>
      <label htmlFor="new-todo">Todo:</label>
      <input type="text" placeholder="Add a new task" />
      <button type="submit">Add Todo</button>
    </form>
  );
}
export default TodoForm;
