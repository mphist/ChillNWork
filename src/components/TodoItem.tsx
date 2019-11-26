import React from "react";
import ListItem from "@material-ui/core/ListItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

import "./TodoItem.scss";

type Todos = {
  id: number;
  name: string;
  done?: boolean;
};

interface PropType {
  todo: Todos;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}

const TodoItem = ({ todo, onToggle, onRemove }: PropType) => {
  /* return (
    <li className={`TodoItem ${todo.done ? `done` : ``} `}>
      <span className="text" onClick={() => onToggle(todo.id)}>
        {todo.name}
      </span>
      <span className="remove" onClick={() => onRemove(todo.id)}>
        (X)
      </span>
    </li>
  ); */

  return (
    <ListItem
      className={`TodoItem ${todo.done ? `done` : ``}`}
      key={todo.id}
      role={undefined}
      dense
      button
      onClick={() => onToggle(todo.id)}
    >
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={todo.done}
          tabIndex={-1}
          disableRipple
          //inputProps={{ 'aria-labelledby': labelId }}
        />
      </ListItemIcon>
      <ListItemText id={String(todo.id)} primary={todo.name} />
      <IconButton aria-label="delete" onClick={() => onRemove(todo.id)}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
};

export default TodoItem;
