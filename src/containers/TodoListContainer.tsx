import React, { useCallback } from "react";
import TodoList from "../components/TodoList";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/modules";
import { toggle, remove, TodosState, order } from "../store/modules/todo";
import axios from "axios";

const TodoListContainer = () => {
  const todos = useSelector((state: RootState) => state.todo);
  console.log("SHOW ME THE TODOS", todos);
  console.log("LOCAL STORAGE", localStorage);
  const dispatch = useDispatch();

  const handleToggle = (id: number) => {
    console.log("toggling", id, todos);
    axios({
      method: "post",
      url: "http://localhost:4000/data/todo/toggle",
      data: { id: id }
    })
      .then(response => {
        console.log("toggling", id);
        dispatch(toggle(id));
      })
      .catch(err => console.log("error toggling todo", err.response));
  };

  const handleRemove = (id: number) => {
    axios({
      method: "post",
      url: "http://localhost:4000/data/todo/remove",
      data: { id: id }
    })
      .then(response => {
        console.log("removing", id);
        dispatch(remove(id));
      })
      .catch(err => console.log("error removing todo", err.response));
  };

  const onDragEnd = useCallback(
    result => {
      console.log("onDragEnd", todos);
      if (!result.destination) {
        return;
      }
      const newOrder = reOrder(
        todos,
        result.source.index,
        result.destination.index
      );
      axios({
        method: "post",
        url: "http://localhost:4000/data/todo/rearrange",
        data: {
          source_idx: result.source.index + 1,
          destination_idx: result.destination.index + 1
        }
      })
        .then(response => {
          console.log("new order is", todos, newOrder, response);
        })
        .catch(err => console.log("Couldn't reorder todolist ", err.response));
      dispatch(order(newOrder));
    },
    [todos, dispatch]
  );

  const reOrder = (list: TodosState, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="droppable-container"
        style={{ overflow: "auto", height: `calc(100vh - 163px)` }}
      >
        <Droppable droppableId="droppable">
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <TodoList
                todos={todos}
                handleToggle={handleToggle}
                handleRemove={handleRemove}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default TodoListContainer;
