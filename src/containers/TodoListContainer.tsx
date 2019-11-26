import React, { useCallback } from "react";
import TodoList from "../components/TodoList";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/modules";
import { toggle, remove, TodosState, order } from "../store/modules/todo";

const TodoListContainer = () => {
  const todos = useSelector((state: RootState) => state.todo);

  const dispatch = useDispatch();

  const handleToggle = (id: number) => {
    dispatch(toggle(id));
  };

  const handleRemove = (id: number) => {
    dispatch(remove(id));
  };

  const onDragEnd = useCallback(
    result => {
      if (!result.destination) {
        return;
      }

      const newOrder = reOrder(
        todos,
        result.source.index,
        result.destination.index
      );

      dispatch(order(newOrder));
    },
    [todos]
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
