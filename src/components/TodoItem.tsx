import React from "react";
import {
  ListItem,
  Checkbox,
  ListItemIcon,
  ListItemText,
  IconButton
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Todos } from "../store/modules/todo";

import "./TodoItem.scss";

interface PropType {
  todo: Todos;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}

const TodoItem = ({ todo, onToggle, onRemove }: PropType) => {
  return (
    <ListItem
      className={`TodoItem ${todo.done ? `done` : ``}`}
      key={todo.id}
      role={undefined}
      dense
      button
      onClick={() => onToggle(todo.order_id)}
    >
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={todo.done}
          tabIndex={-1}
          disableRipple
        />
      </ListItemIcon>
      <ListItemText id={String(todo.id)} primary={todo.task} />
      <IconButton aria-label="delete" onClick={() => onRemove(todo.order_id)}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
};

export default TodoItem;
