import React, { useCallback } from "react";
import TodoList from "../components/TodoList";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/modules";
import {
  toggle,
  remove,
  TodosState,
  order,
  Todos
} from "../store/modules/todo";
import axios from "axios";

const TodoListContainer = () => {
  const todos = useSelector((state: RootState) => state.todo);
  console.log("SHOW ME THE TODOS", todos);
  //console.log("LOCAL STORAGE", localStorage);
  const dispatch = useDispatch();

  const handleToggle = (id: number, email: string) => {
    console.log("toggling", id, todos);
    axios({
      method: "post",
      url: process.env.REACT_APP_SITE_API_URL + "/data/todo/toggle",
      data: { id: id, email: email }
    })
      .then(response => {
        console.log("toggling", id);
        dispatch(toggle(id));
      })
      .catch(err => console.log("error toggling todo", err.response));
  };

  const handleRemove = (id: number, email: string) => {
    axios({
      method: "post",
      url: process.env.REACT_APP_SITE_API_URL + "/data/todo/remove",
      data: { id: id, email: email }
    })
      .then(response => {
        console.log("removing", id);
        dispatch(remove(id));
      })
      .catch(err => console.log("error removing todo", err.response));
  };

  const onDragEnd = useCallback(
    result => {
      console.log("onDragEnd", result);
      if (!result.destination) {
        return;
      }
      const newOrder = reOrder(
        todos,
        result.source.index,
        result.destination.index
      );
      const todos_array = Array.from(todos);
      axios({
        method: "post",
        url: process.env.REACT_APP_SITE_API_URL + "/data/todo/rearrange",
        data: {
          source_idx: todos_array[result.source.index].order_id, //result.source.index + 1,
          destination_idx: todos_array[result.destination.index].order_id, //result.destination.index + 1
          email: todos_array[result.source.index].email
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

  /* const reOrder = (list: TodosState, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    const temp = result[endIndex].order_id;
    result[endIndex].order_id = result[startIndex].order_id;
    result[startIndex].order_id = temp;
    return result;
  }; */
  const reOrder = (list: TodosState, startIndex: number, endIndex: number) => {
    const todoList = Array.from(list);
    const source = todoList[startIndex].order_id;
    const destination = todoList[endIndex].order_id;
    if (source > destination) {
      const newResult = todoList.map(el => {
        if (el.order_id >= destination && el.order_id < source) {
          el.order_id++;
        } else if (el.order_id === source) {
          el.order_id = destination;
        }
        return el;
      });
      const [removed] = newResult.splice(startIndex, 1);
      newResult.splice(endIndex, 0, removed);
      return newResult;
    } else if (source < destination) {
      const newResult = todoList.map(el => {
        if (el.order_id > source && el.order_id <= destination) {
          el.order_id--;
        } else if (el.order_id === source) {
          el.order_id = destination;
        }
        return el;
      });
      const [removed] = newResult.splice(startIndex, 1);
      newResult.splice(endIndex, 0, removed);
      return newResult;
    } else {
      return todoList;
    }
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
