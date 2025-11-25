"use client";

import { useState, useEffect } from "react";
import Todo from "./components/todo";
import SharedUsers from "./components/sharedUsers";
import { Button, Stack, Box, Typography, Popper, TextField } from '@mui/material';

export default function Todolist({
  todos,
  todolistInput,
  shared,
}: {
  todos: {
    data: { id: number; task: string; completed: boolean }[];
  };
  todolistInput: { 
    name: string; id: number; ownerID: number
  };
  shared: boolean;
}) {
  const [todoList, setTodoList] = useState(todos.data);
  const [showSharedUsers, setShowSharedUsers] = useState(false);
  const [sharedUsersData, setSharedUsersData] = useState( { data: [] as string[] } );

  useEffect(() => {
    setTodoList(todos.data);
    setSharedUsersData( { data: [] as string[] } );
    setShowSharedUsers(false);
  }, [todos.data]);

  // For popper
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <Box>
      <Stack spacing={2} direction="row" alignItems="center">
        <Typography variant="h5" component="p">Todolist: {todolistInput.name}</Typography>
        <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleClick}
        >+</Button>
        <Popper id={id} open={open} anchorEl={anchorEl}>
          <Stack spacing={2} padding={2} bgcolor="gray" boxShadow={3}>
            <Typography variant="h6" component="p">Make new todo:</Typography>
            <TextField name="taskInput" label="Type todo here" variant="outlined"/>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={() => {
                let input = document.querySelector("input[name='taskInput']") as HTMLInputElement;
                fetch("/api/AddTodo", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ task: input?.value, listID: todolistInput.id.toString() }),
                })
                  .then((res) => res.json())
                  .then((todo) => setTodoList([...todoList, todo.data]));
                input!.value = "";
              }}
            >
              Create
            </Button>
          </Stack>
        </Popper>
      </Stack>
      <Box>
        {todoList.map(
          (todo: { id: number; task: string; completed: boolean }) => (
            <Todo
              key={todo.id}
              todo={todo}
              todoList={todoList}
              setTodoList={setTodoList}
            />
          )
        )}
      </Box>
      {/*TODO look at this later*/}
      <Box alignItems="flex-end">
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() =>
              fetch("/api/ClearTodo?listID=" + todolistInput.id.toString(), {
                method: "DELETE",
              }).then(() => setTodoList([]))
            }
          >
            Clear todo-list
          </Button>
          
          {!shared && (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={async () => {
                if (sharedUsersData.data.length === 0) {
                  var sharedUsersResponse = await fetch("/api/GetUsersWithSharedAccess?listID=" + todolistInput.id.toString());
                  setSharedUsersData(await sharedUsersResponse.json());
                }
                setShowSharedUsers(!showSharedUsers);
              }}
            >
              show shared users
            </Button>
          )}

        </Stack>
        
        {showSharedUsers && (
          <Stack spacing={2} direction="row" justifyContent="space-between">
            <Stack spacing={2}>
              <Typography variant="h6" component="p">Share todolist</Typography>
              <TextField name="shareInput" label="Type username here" variant="outlined"/>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={() => {
                  var input = document.querySelector("input[name='shareInput']") as HTMLInputElement | null;
                  const username = input?.value ?? "";
                  fetch("/api/ShareTodoList", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username: username, listID: todolistInput.id.toString() }),
                  })
                  .then((res) => {
                    if (res.ok) {
                      setSharedUsersData(prev => ({ data: [...prev.data, username] }));
                    }
                  });
                  if (input) input.value = "";
                }}
              >
                Share
              </Button>
            </Stack>
            <SharedUsers 
            users={sharedUsersData} 
            listID={todolistInput.id.toString()}
            setSharedUsersData={setSharedUsersData}
            />
          </Stack>
        )}
      </Box>
    </Box>
  );
}
