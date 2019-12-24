import React from "react";
import TodoListContainer from "../containers/TodoListContainer";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import "./Todo.scss";

interface PropsType {
  handleAddTodo: () => void;
}

const Todo = ({ handleAddTodo }: PropsType) => {
  return (
    <div id="todo-overlay" className="todo-overlay">
      <div className="header-wrapper">
        <h3 className="todo-header">To Do</h3>
      </div>
      <div className="btn-wrapper">
        <span
          className="close-btn"
          onClick={() => {
            const el = document.getElementById("todo-overlay");
            if (el != null) {
              el.className = "todo-overlay-inactive";
            }
          }}
        >
          X
        </span>
      </div>
      <div className="input-wrapper">
        <TextField
          id="input-task"
          label="New task"
          onKeyUp={e => {
            if (e.keyCode === 13) {
              handleAddTodo();
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          className={"button"}
          onClick={handleAddTodo}
          style={{ transform: `translateY('3px')`, margin: "10px" }}
        >
          Add
        </Button>
      </div>

      <TodoListContainer />
    </div>
  );
};

export default Todo;
