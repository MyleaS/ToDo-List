function TodoForm() {
  return (
    <form>
      <label htmlFor="new-todo">Todo:</label>
      <input id="new-todo" type="text" placeholder="Add a new task" />
      <button type="submit">Add</button>
    </form>
  );
}
export default TodoForm;
