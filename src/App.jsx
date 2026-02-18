import { useState, useEffect, useCallback, useReducer } from "react";
import {
  Routes,
  Route,
  NavLink,
  useLocation,
  useSearchParams,
  useNavigate,
} from "react-router";
import TodosPage from "./pages/TodosPage.jsx";
import About from "./pages/About.jsx";
import NotFound from "./pages/NotFound.jsx";
import Header from "./shared/Header";
import styles from "./App.module.css";
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from "./reducers/todos.reducer";

function App() {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ programmatic navigation
  const [searchParams, setSearchParams] = useSearchParams();
  const [title, setTitle] = useState("Todo List");

  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [todoListState, dispatch] = useReducer(todosReducer, initialTodosState);
  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryString, setQueryString] = useState("");

  const totalPages = Math.ceil(
    (todoListState.todoList || []).length / itemsPerPage
  );

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${
    import.meta.env.VITE_TABLE_NAME
  }`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  // -----------------------------
  // Validate currentPage safely
  // -----------------------------
  useEffect(() => {
    if (totalPages > 0) {
      // ✅ only navigate if there are pages
      if (
        isNaN(currentPage) || // not a number
        currentPage < 1 || // less than first page
        currentPage > totalPages // greater than last page
      ) {
        navigate("/"); // redirect to home
      }
    }
  }, [currentPage, totalPages, navigate]);

  useEffect(() => {
    if (location.pathname === "/") setTitle("Todo List");
    else if (location.pathname === "/about") setTitle("About");
    else setTitle("Not Found");
  }, [location]);

  const encodeUrl = useCallback(() => {
    const sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = "";
    if (queryString)
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [url, sortField, sortDirection, queryString]);

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
        dispatch({ type: todoActions.loadTodos, records: data.records });
      } catch (error) {
        dispatch({ type: todoActions.setLoadError, error });
      }
    };
    fetchTodos();
  }, [encodeUrl, token]);

  async function addTodo(title) {
    const payload = { records: [{ fields: { title, isCompleted: false } }] };
    dispatch({ type: todoActions.startRequest });
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(
          errorData.error?.message || `HTTP error! status: ${resp.status}`
        );
      }
      const { records } = await resp.json();
      dispatch({ type: todoActions.addTodo, record: records[0] });
      dispatch({ type: todoActions.endRequest });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, error });
      dispatch({ type: todoActions.endRequest });
    }
  }

  function completeTodo(id) {
    dispatch({ type: todoActions.completeTodo, id });
  }

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
    dispatch({ type: todoActions.updateTodo, editedTodo });
    try {
      const resp = await fetch(url, {
        method: "PATCH",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
    } catch (error) {
      dispatch({
        type: todoActions.revertTodo,
        editedTodo: originalTodo,
        error,
      });
    }
  }

  // -----------------------------
  // Pagination Handlers
  // -----------------------------
  function handlePreviousPage() {
    const prevPage = Math.max(currentPage - 1, 1);
    setSearchParams({ page: prevPage });
  }

  function handleNextPage() {
    const nextPage = Math.min(currentPage + 1, totalPages);
    setSearchParams({ page: nextPage });
  }

  return (
    <div className={styles.appContainer}>
      <div className={styles.todoContainer}>
        <Header title={title} />

        <nav className={styles.nav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? styles.active : styles.inactive
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? styles.active : styles.inactive
            }
          >
            About
          </NavLink>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <TodosPage
                todoList={todoListState.todoList}
                isLoading={todoListState.isLoading}
                isSaving={todoListState.isSaving}
                errorMessage={todoListState.errorMessage}
                sortField={sortField}
                setSortField={setSortField}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
                queryString={queryString}
                setQueryString={setQueryString}
                onAddTodo={addTodo}
                onCompleteTodo={completeTodo}
                onUpdateTodo={updateTodo}
                onClearError={() => dispatch({ type: todoActions.clearError })}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Pagination Controls */}
        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1} // disable if first page
            onClick={handlePreviousPage}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages} // disable if last page
            onClick={handleNextPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
