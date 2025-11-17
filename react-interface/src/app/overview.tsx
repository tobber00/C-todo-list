"use client";

import Todolist from "./todolist";
import { useState } from "react";
import { Button } from '@mui/material';

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

  return (
    <div>
      <Button variant="contained">Hello world</Button>
      <Button variant="outlined">Hello world</Button>
      <Button variant="text">Hello world</Button>
      <Button variant="contained" color="error" size="medium">Hello world</Button>
      <p>Your Todolists</p>
      <div>
        {todolists.map(
          (todolist: { name: string; id: number; ownerID: number }) => (
            <div
              key={todolist.id}
              onClick={async () => {
                const todosData = await fetch("/api/GetTodoListItems?listID=" + todolist.id)
                  .then((res) => res.json());
                setSelectedTodolist(todolist);
                setSelectedTodos(todosData.data || []);
                setShowTodolist(true);
                setShared(false);
              }}
            >
              <span>{todolist.name}</span>
              <button 
                className="bg-red-400 ml-2"
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
                  Delete
              </button>
            </div>
          )
        )}
      </div>
      <p>Shared Todolists</p>
      <div>
        {sharedTodolists.map(
          (todolist: { name: string; id: number; ownerID: number }) => (
            <div
              key={todolist.id}
              onClick={async () => {
                const todosData = await fetch("/api/GetTodoListItems?listID=" + todolist.id)
                  .then((res) => res.json());
                setSelectedTodolist(todolist);
                setSelectedTodos(todosData.data || []);
                setShowTodolist(true);
                setShared(true);
              }}
            >
              <span>{todolist.name}</span>
              <button 
                className="bg-red-400 ml-2"
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
                  Leave
              </button>
            </div>
          )
        )}
      </div>
      <p>Create new todolist</p>
      <input type="text" placeholder="Type name here" />
      <button
        className="bg-blue-400"
        onClick={() => {
          let input = document.querySelector("input");
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
      </button>
      {showTodolist && selectedTodolist && (
        <Todolist
          todos={{ data: selectedTodos }}
          todolistInput={selectedTodolist}
          shared={isShared}
        />
      )}
      {!showTodolist && <div>Click on a todolist to show it's contents</div>}
    </div>
  );
}
