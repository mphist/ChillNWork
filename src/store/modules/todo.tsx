const ADD = "todo/ADD" as const;
const TOGGLE = "todo/TOGGLE" as const;
const REMOVE = "todo/REMOVE" as const;
const ORDER = "todo/ORDER" as const;
const REMOVE_FROM_STORE = "todo/REMOVE_FROM_STORE" as const;
const FETCH_TODOS = "todo/FETCH_TODOS" as const;

export const add = (
  email: string,
  task: string,
  done: boolean = false,
  order_id: number
) => ({
  type: ADD,
  payload: { email, task, done, order_id }
});

export const toggle = (idx: number) => ({ type: TOGGLE, id: idx });
export const remove = (idx: number) => ({ type: REMOVE, id: idx });
export const removeFromStore = () => ({ type: REMOVE_FROM_STORE });
export const fetchTodos = (data: []) => ({ type: FETCH_TODOS, data });
export const order = (newOrder: TodosState) => ({
  type: ORDER,
  newState: newOrder
});

type TodoAction =
  | ReturnType<typeof add>
  | ReturnType<typeof toggle>
  | ReturnType<typeof remove>
  | ReturnType<typeof order>
  | ReturnType<typeof removeFromStore>
  | ReturnType<typeof fetchTodos>;

export interface Todos {
  id: number;
  email: string;
  task: string;
  done: boolean;
  order_id: number;
}

export type TodosState = Todos[];

const initialState: TodosState = [];

export default function todo(
  state: TodosState = initialState,
  action: TodoAction
): TodosState {
  switch (action.type) {
    case ADD:
      const id = state.length ? state.length + 1 : 1;
      return state.concat({
        id: id,
        email: action.payload.email,
        task: action.payload.task,
        done: action.payload.done,
        order_id: action.payload.order_id
      });
    case TOGGLE:
      return state.map(todo =>
        todo.order_id === action.id ? { ...todo, done: !todo.done } : todo
      );
    case REMOVE:
      return state.filter(todo => todo.order_id !== action.id);
    case ORDER:
      return action.newState;
    case FETCH_TODOS:
      return action.data;
    case REMOVE_FROM_STORE:
      return initialState;
    default:
      return state;
  }
}
