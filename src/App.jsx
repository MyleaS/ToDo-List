import { useState, useEffect, useCallback, useReducer } from "react";
import TodoList from "./features/TodoList/TodoList";
import TodoForm from "./features/TodoForm";
import TodosViewForm from "./features/TodosViewForm";
import "./App.css";
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from "./reducers/todos.reducer";

function App() {
  const [todoListState, dispatch] = useReducer(todosReducer, initialTodosState);

  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryString, setQueryString] = useState("");

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${
    import.meta.env.VITE_TABLE_NAME
  }`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const encodeUrl = useCallback(() => {
    const sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;

    let searchQuery = "";
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }

    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [url, sortField, sortDirection, queryString]);

  // FETCH TODOS
  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });

      try {
        const resp = await fetch(encodeUrl(), {
          method: "GET",
          headers: { Authorization: token },
        });

        if (!resp.ok) {
          const errorData = await resp.json();
          throw new Error(
            errorData.error?.message || `HTTP error! status: ${resp.status}`
          );
        }

        const data = await resp.json();

        dispatch({
          type: todoActions.loadTodos,
          records: data.records,
        });
      } catch (error) {
        dispatch({
          type: todoActions.setLoadError,
          error,
        });
      }
    };

    fetchTodos();
  }, [encodeUrl, token]);

  // ADD TODO
  async function addTodo(title) {
    const payload = {
      records: [{ fields: { title, isCompleted: false } }],
    };

    dispatch({ type: todoActions.startRequest });

    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(
          errorData.error?.message || `HTTP error! status: ${resp.status}`
        );
      }

      const { records } = await resp.json();

      dispatch({
        type: todoActions.addTodo,
        record: records[0],
      });

      dispatch({ type: todoActions.endRequest });
    } catch (error) {
      dispatch({
        type: todoActions.setLoadError,
        error,
      });

      dispatch({ type: todoActions.endRequest });
    }
  }

  // COMPLETE TODO
  function completeTodo(id) {
    dispatch({
      type: todoActions.completeTodo,
      id,
    });
  }

  // UPDATE TODO (Optimistic)
  async function updateTodo(editedTodo) {
    const originalTodo = todoListState.todoList.find(
      (todo) => todo.id === editedTodo.id
    );

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    // Optimistic update
    dispatch({
      type: todoActions.updateTodo,
      editedTodo,
    });

    try {
      const resp = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }
    } catch (error) {
      dispatch({
        type: todoActions.revertTodo,
        editedTodo: originalTodo,
        error,
      });
    }
  }

  return (
    <div className="appContainer">
      <div className="todoContainer">
        <h1>Todo List</h1>

        {todoListState.isLoading && <p>Loading...</p>}

        <TodoForm onAddTodo={addTodo} isSaving={todoListState.isSaving} />

        <TodoList
          todoList={todoListState.todoList}
          isLoading={todoListState.isLoading}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
        />

        <TodosViewForm
          sortField={sortField}
          setSortField={setSortField}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          queryString={queryString}
          setQueryString={setQueryString}
        />

        {todoListState.errorMessage && (
          <div className="errorMessage">
            <hr />
            <p>{todoListState.errorMessage}</p>
            <button onClick={() => dispatch({ type: todoActions.clearError })}>
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
