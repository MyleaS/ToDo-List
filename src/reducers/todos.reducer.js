// src/reducers/todos.reducer.js

const actions = {
  // actions in useEffect that loads todos
  fetchTodos: "fetchTodos",
  loadTodos: "loadTodos",

  // found in useEffect and addTodo to handle failed requests
  setLoadError: "setLoadError",

  // actions found in addTodo
  startRequest: "startRequest",
  addTodo: "addTodo",
  endRequest: "endRequest",

  // found in helper functions
  updateTodo: "updateTodo",
  completeTodo: "completeTodo",

  // reverts todos when requests fail
  revertTodo: "revertTodo",

  // action on Dismiss Error button
  clearError: "clearError",
};

export { actions };

export const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: null,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    // pessimistic UI: start loading todos
    case actions.fetchTodos:
      return {
        ...state,
        isLoading: true,
      };

    // load todos after successful request
    case actions.loadTodos:
      return {
        ...state,
        todoList: action.records.map((record) => ({
          id: record.id,
          ...record.fields,
          isCompleted: record.fields.isCompleted ?? false,
        })),
        isLoading: false,
      };

    // start addTodo request
    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
      };

    // add todo after successful save
    case actions.addTodo: {
      const savedTodo = {
        id: action.record.id,
        ...action.record.fields,
        isCompleted: action.record.fields.isCompleted ?? false,
      };

      return {
        ...state,
        todoList: [...state.todoList, savedTodo],
        isSaving: false,
      };
    }
    // end any request (general purpose)
    case actions.endRequest:
      return {
        ...state,
        isLoading: false,
        isSaving: false,
      };

    // handle errors during load or add
    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error.message,
        isLoading: false,
        isSaving: false,
      };

    // revertTodo falls through to updateTodo
    case actions.revertTodo:
    case actions.updateTodo: {
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.editedTodo.id
            ? {
                ...todo,
                ...action.editedTodo,
                ...(action.error && {
                  errorMessage: action.error.message,
                }),
              }
            : todo
        ),
      };
    }

    // completeTodo
    case actions.completeTodo: {
      const completedTodos = state.todoList.map((todo) =>
        todo.id === action.id ? { ...todo, isCompleted: true } : todo
      );

      return {
        ...state,
        todoList: completedTodos,
      };
    }
    // clear error message (Dismiss Error button)
    case actions.clearError:
      return {
        ...state,
        errorMessage: "", // now resets to empty string
      };

    default:
      return state;
  }
}

export { reducer };
