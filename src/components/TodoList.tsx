import React from "react";
import TodoItem from "./TodoItem";
import List from "@material-ui/core/List";
import "./TodoList.scss";
import { Draggable } from "react-beautiful-dnd";
import { Todos } from "../store/modules/todo";

interface PropType {
  todos: Todos[];
  handleToggle: (id: number, email: string) => void;
  handleRemove: (id: number, email: string) => void;
}

const TodoList = ({ todos, handleToggle, handleRemove }: PropType) => {
  const todoItemList: React.ReactElement[] = todos.map((todo, idx) => (
    <Draggable key={todo.id} draggableId={`draggable-${todo.id}`} index={idx}>
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <TodoItem
            todo={todo}
            key={todo.id}
            onToggle={handleToggle}
            onRemove={handleRemove}
          />
        </div>
      )}
    </Draggable>
  ));

  return (
    <div className="todoList">
      <List>{todoItemList}</List>
    </div>
  );
};

export default TodoList;
