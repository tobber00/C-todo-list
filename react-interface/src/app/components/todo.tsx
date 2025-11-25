"use client";

import { useState } from "react";
import { Button, Box, Typography, Checkbox, Stack } from '@mui/material';

export default function Todo({
  todo,
  todoList,
  setTodoList,
}: {
  todo: { id: number; task: string; completed: boolean };
  todoList: { id: number; task: string; completed: boolean }[];
  setTodoList: React.Dispatch<
    React.SetStateAction<{ id: number; task: string; completed: boolean }[]>
  >;
}) {
  const [completed, setCompleted] = useState(todo.completed);
  return (
    <Box key={todo.id}>
      <Stack spacing={2} direction="row" justifyContent="space-between">
        <Checkbox
          checked={completed}
          onChange={async () => {
            await fetch("/api/ChangeCompletion?todoID=" + todo.id, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ Completion: !completed }),
            });
            setCompleted(!completed);
          }}
        />
        <Typography variant="subtitle1" component="span">{todo.task}</Typography>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => {
            fetch("/api/DeleteTodo?todoID=" + todo.id, {
              method: "DELETE",
            }).then(() => {
              var newTodoList = [...todoList];
              newTodoList.splice(todoList.indexOf(todo), 1);
              setTodoList(newTodoList);
            });
          }}
        >
          X
        </Button>
      </Stack>
    </Box>
  );
}
