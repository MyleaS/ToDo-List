import { useRef, useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";
import styled from "styled-components";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* spacing between form items */
  padding: 0.5rem;
`;

const StyledButton = styled.button`
  padding: 0.5rem 0.75rem;

  &:disabled {
    font-style: italic;
  }
`;

function TodoForm({ onAddTodo, isSaving }) {
  const todoTitleInput = useRef(null);
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");

  function handleAddTodo(event) {
    event.preventDefault();

    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle("");

    todoTitleInput.current.focus();
  }

  return (
    <StyledForm onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="new-todo"
        labelText="Todo"
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        ref={todoTitleInput}
      />

      <StyledButton
        type="submit"
        disabled={workingTodoTitle === "" || isSaving}
      >
        {isSaving ? "Saving..." : "Add Todo"}
      </StyledButton>
    </StyledForm>
  );
}

export default TodoForm;
