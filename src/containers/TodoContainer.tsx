import React from "react";
import Todo from "../components/Todo";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/modules";
import { add } from "../store/modules/todo";
import axios from "axios";

const TodoContainer = () => {
  const todos = useSelector((state: RootState) => state.todo);
  const email = useSelector((state: RootState) => state.auth.email);

  const dispatch = useDispatch();

  const pushTodo = async (
    email: string | null,
    task: string,
    done: boolean
  ) => {
    await axios({
      method: "post",
      url: process.env.REACT_APP_SITE_API_URL + "/data/todo/push",
      data: {
        email: email,
        task: task,
        done: done
      }
    });
  };

  const handleAddTodo = () => {
    const task = (document.getElementById("input-task") as HTMLInputElement)
      .value;
    const order_id = todos.length + 1;
    if (email && task) {
      pushTodo(email, task, false)
        .then(function(response) {
          if (order_id !== null && email !== null) {
            console.log("dispatch add");
            dispatch(add(email, task, false, order_id));
          }
          (document.getElementById("input-task") as HTMLInputElement).value =
            "";
        })
        .catch(function(err) {
          console.log("Couldn't push Todos to server", err.response);
        });
    } else {
      console.log("whats going on");
    }
  };
  return <Todo handleAddTodo={handleAddTodo} />;
};

export default TodoContainer;
