import React from "react";
import Todo from "../components/Todo";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/modules";
import { add } from "../store/modules/todo";

const TodoContainer = () => {
  const todos = useSelector((state: RootState) => state.todo);

  const dispatch = useDispatch();

  const handleAddTodo = () => {
    const value = (document.getElementById("input-task") as HTMLInputElement)
      .value;
    const idx = todos.length;
    if (value !== "") {
      dispatch(add(value, idx));
      (document.getElementById("input-task") as HTMLInputElement).value = "";
    }
  };

  return <Todo handleAddTodo={handleAddTodo} />;
};

export default TodoContainer;
