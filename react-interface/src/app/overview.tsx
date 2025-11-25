"use client";

import Todolist from "./todolist";
import { useState } from "react";
import {
  Button,
  Stack,
  Box,
  Typography,
  Popper,
  TextField,
  Grid,
  Paper,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardActionArea,
} from "@mui/material";

export default function Overview({
  todolistsInput,
  sharedTodolistsInput,
  userID,
}: {
  todolistsInput: { data: { name: string; id: number; ownerID: number }[] };
  sharedTodolistsInput: {
    data: { name: string; id: number; ownerID: number }[];
  };
  userID: number;
}) {
  const [todolists, setTodolists] = useState(todolistsInput.data);
  const [sharedTodolists, setSharedTodolists] = useState(
    sharedTodolistsInput.data
  );
  const [showTodolist, setShowTodolist] = useState(false);
  const [selectedTodolist, setSelectedTodolist] = useState<{
    name: string;
    id: number;
    ownerID: number;
  } | null>(null);
  const [selectedTodos, setSelectedTodos] = useState<
    { id: number; task: string; completed: boolean }[]
  >([]);
  const [isShared, setShared] = useState(false);

  // For popper
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const [newTodolistName, setNewTodolistName] = useState("");

  return (
    <Grid container spacing={4} sx={{ p: 2 }}>
      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <Paper elevation={8} sx={{ p: 2, height: "100%", width: "100%" }}>
          <Stack
            spacing={1}
            alignItems="center"
            direction="row"
            justifyContent="space-between"
            sx={{ mb: 1 }}
          >
            <Typography variant="h5" component="h2">
              Your Todolists
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleClick}
            >
              +
            </Button>
            <Popper id={id} open={open} anchorEl={anchorEl}>
              <Card elevation={8}>
                <CardHeader title="Create new todolist" />
                <CardContent>
                  <TextField
                    name="createTodoListInput"
                    label="Todolist name"
                    variant="outlined"
                    multiline={true}
                    fullWidth
                    value={newTodolistName}
                    onChange={(e) => setNewTodolistName(e.target.value)}
                  />
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    onClick={() => {
                      fetch("/api/CreateTodoList", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          name: newTodolistName,
                          ownerID: userID,
                        }),
                      })
                        .then((res) => res.json())
                        .then((todolist) =>
                          setTodolists([...todolists, todolist.data])
                        );
                      setNewTodolistName("");
                    }}
                    sx={{ width: "100%" }}
                  >
                    Create
                  </Button>
                </CardActions>
              </Card>
            </Popper>
          </Stack>
          <Stack direction="column" spacing={1.5}>
            {todolists.map(
              (todolist: { name: string; id: number; ownerID: number }) => (
                <Box key={todolist.id}>
                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      onClick={async () => {
                        const todosData = await fetch(
                          "/api/GetTodoListItems?listID=" + todolist.id
                        ).then((res) => res.json());
                        setSelectedTodolist(todolist);
                        setSelectedTodos(todosData.data || []);
                        setShowTodolist(true);
                        setShared(false);
                      }}
                    >
                      {todolist.name}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={async (e) => {
                        await fetch(
                          "/api/DeleteTodoList?listID=" + todolist.id,
                          {
                            method: "DELETE",
                            headers: {
                              "Content-Type": "application/json",
                            },
                          }
                        );
                        if (selectedTodolist?.id === todolist.id) {
                          setShowTodolist(false);
                        }
                        setTodolists(
                          todolists.filter((tl) => tl.id !== todolist.id)
                        );
                      }}
                    >
                      X
                    </Button>
                  </Stack>
                </Box>
              )
            )}
          </Stack>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <Paper elevation={8} sx={{ p: 2, height: "100%", width: "100%" }}>
          <Typography variant="h5" component="h2">
            Shared Todolists
          </Typography>
          <Stack direction="column" spacing={1.5}>
            {sharedTodolists.map(
              (todolist: { name: string; id: number; ownerID: number }) => (
                <Box key={todolist.id}>
                  <Typography
                    variant="h6"
                    component="div"
                    onClick={async () => {
                      const todosData = await fetch(
                        "/api/GetTodoListItems?listID=" + todolist.id
                      ).then((res) => res.json());
                      setSelectedTodolist(todolist);
                      setSelectedTodos(todosData.data || []);
                      setShowTodolist(true);
                      setShared(true);
                    }}
                  >
                    {todolist.name}
                  </Typography>
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
                        body: JSON.stringify({
                          userID: userID,
                          listID: todolist.id.toString(),
                        }),
                      });
                      if (selectedTodolist?.id === todolist.id) {
                        setShowTodolist(false);
                      }
                      setSharedTodolists(
                        sharedTodolists.filter((tl) => tl.id !== todolist.id)
                      );
                    }}
                  >
                    X
                  </Button>
                </Box>
              )
            )}
          </Stack>
        </Paper>
      </Grid>
      <Grid container size={{ xs: 12, md: 12, lg: 6 }}>
        <Paper elevation={8} sx={{ p: 2, height: "100%", width: "100%" }}>
          {showTodolist && selectedTodolist && (
            <Todolist
              todos={{ data: selectedTodos }}
              todolistInput={selectedTodolist}
              shared={isShared}
            />
          )}
          {!showTodolist && (
            <Typography variant="subtitle1" component="div">
              Click on a todolist to show it's contents
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
