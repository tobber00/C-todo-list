"use client";

import Todolist from "./todolist";
import { useState } from "react";
import { Button, Stack, Box, Typography, Popper, TextField } from '@mui/material';

export default function Overview({
  todolistsInput,
  sharedTodolistsInput,
  userID,
}: {
  todolistsInput: { data: { name: string; id: number; ownerID: number }[] };
  sharedTodolistsInput: { data: { name: string; id: number; ownerID: number }[] };
  userID: number;
}) {
  const [todolists, setTodolists] = useState(todolistsInput.data);
  const [sharedTodolists, setSharedTodolists] = useState(sharedTodolistsInput.data);
  const [showTodolist, setShowTodolist] = useState(false);
  const [selectedTodolist, setSelectedTodolist] = useState<{ name: string; id: number; ownerID: number } | null>(null);
  const [selectedTodos, setSelectedTodos] = useState<{ id: number; task: string; completed: boolean }[]>([]);
  const [isShared, setShared] = useState(false);

  // For popper
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <Stack spacing={4} direction="row" justifyContent="space-around" padding={2}>
      <Stack direction="row" justifyContent="space-between" spacing={4}>
        <Stack spacing={1}>
          <Stack spacing={1} alignItems="center" direction="row">
              <Typography variant="h5" component="h2">Your Todolists</Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleClick}
              >+</Button>
            <Popper id={id} open={open} anchorEl={anchorEl}>
              <Stack spacing={2} padding={2} bgcolor="gray" boxShadow={3}>
                <Typography variant="h6" component="h6">Create new todolist</Typography>
                <TextField name="createTodoListInput" label="Todolist name" variant="outlined"/>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  onClick={() => {
                    let input = document.querySelector("input[name='createTodoListInput']") as HTMLInputElement;
                    fetch("/api/CreateTodoList", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ name: input?.value, ownerID: userID }),
                    })
                      .then((res) => res.json())
                      .then((todolist) => setTodolists([...todolists, todolist.data]));
                    input!.value = "";
                  }}
                >
                  Create
                </Button>
              </Stack>
            </Popper>
          </Stack>
          <Stack direction="column" spacing={1.5}>
            {todolists.map(
              (todolist: { name: string; id: number; ownerID: number }) => (
                <Box
                  key={todolist.id}> 
                  <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" component="div"
                      onClick={async () => {
                        const todosData = await fetch("/api/GetTodoListItems?listID=" + todolist.id)
                          .then((res) => res.json());
                        setSelectedTodolist(todolist);
                        setSelectedTodos(todosData.data || []);
                        setShowTodolist(true);
                        setShared(false);
                      }}
                    >{todolist.name}</Typography>
                    <Button 
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={async (e) => {
                        await fetch("/api/DeleteTodoList?listID=" + todolist.id, {
                          method: "DELETE",
                          headers: {
                            "Content-Type": "application/json",
                          },
                        });
                        if (selectedTodolist?.id === todolist.id) {
                          setShowTodolist(false);
                        }
                        setTodolists(todolists.filter(tl => tl.id !== todolist.id));
                      }}>
                        X
                    </Button>
                  </Stack>
                </Box>
              )
            )}
          </Stack>
        </Stack>
        <Stack spacing={1} alignItems="center">
          <Typography variant="h5" component="h2">Shared Todolists</Typography>
          <Stack direction="column" spacing={1.5}>
            {sharedTodolists.map(
              (todolist: { name: string; id: number; ownerID: number }) => (
                <Box
                  key={todolist.id}
                  
                >
                  <Typography variant="h6" component="div"
                    onClick={async () => {
                    const todosData = await fetch("/api/GetTodoListItems?listID=" + todolist.id)
                      .then((res) => res.json());
                    setSelectedTodolist(todolist);
                    setSelectedTodos(todosData.data || []);
                    setShowTodolist(true);
                    setShared(true);
                  }}
                  >{todolist.name}</Typography>
                  <Button 
                      variant="outlined"
                      color="error"
                      size="small"
                    onClick={async () => {
                      await fetch("/api/UnfollowTodoList", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ userID: userID, listID: todolist.id.toString() }),
                      });
                      if (selectedTodolist?.id === todolist.id) {
                        setShowTodolist(false);
                      }
                      setSharedTodolists(sharedTodolists.filter(tl => tl.id !== todolist.id));
                    }}>
                      X
                  </Button>
                </Box>
              )
            )}
          </Stack>
        </Stack>
      </Stack>
      <Stack spacing={2} justifyContent="flex-start">
        {showTodolist && selectedTodolist && (
          <Todolist
            todos={{ data: selectedTodos }}
            todolistInput={selectedTodolist}
            shared={isShared}
          />
        )}
        {!showTodolist && 
          <Typography variant="subtitle1" component="div">Click on a todolist to show it's contents</Typography>
        }
      </Stack>
    </Stack>
  );
}
