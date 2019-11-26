const ADD = "todo/ADD" as const;
const TOGGLE = "todo/TOGGLE" as const;
const REMOVE = "todo/REMOVE" as const;
const ORDER = "todo/ORDER" as const;

export const add = (value: string, idx: number) => ({
  type: ADD,
  payload: { value, idx }
});

export const toggle = (idx: number) => ({ type: TOGGLE, id: idx });

export const remove = (idx: number) => ({ type: REMOVE, id: idx });

export const order = (newOrder: TodosState) => ({
  type: ORDER,
  newState: newOrder
});

type TodoAction =
  | ReturnType<typeof add>
  | ReturnType<typeof toggle>
  | ReturnType<typeof remove>
  | ReturnType<typeof order>;

interface Todos {
  name: string;
  id: number;
  done: boolean;
}

export type TodosState = Todos[];

const initialState: TodosState = [
  { name: "test", id: 0, done: false },
  { name: "test2", id: 1, done: false }
];

export default function todo(
  state: TodosState = initialState,
  action: TodoAction
): TodosState {
  switch (action.type) {
    case ADD:
      const todos = state.map(todo => todo.id);
      const id =
        todos.length > 0 ? Math.max(...state.map(todo => todo.id)) + 1 : 0;
      return state.concat({ name: action.payload.value, id: id, done: false });
    case TOGGLE:
      return state.map(todo =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );
    case REMOVE:
      return state.filter(todo => todo.id !== action.id);

    case ORDER:
      return action.newState;

    default:
      return state;
  }
}
