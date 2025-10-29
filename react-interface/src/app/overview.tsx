"use client";

import Todo from "./components/todo";
import todolist from "./todolist";
import { useState } from "react";

export default function Overview({
  todolistsInput,
  userID,
}: {
  todolistsInput: { data: { name: string; id: number; ownerID: number }[] };
  userID: number;
}) {
  const [todolists, setTodolists] = useState(todolistsInput.data);
  var selectedTodolist = null;
  var selectedTodolistItems = new todoListItems(null);

  type todoListItems = { id: number; task: string; completed: boolean }[];

  return (
    <div>
      <p>Your Todolists</p>
      <div>
        {todolists.map(
          (todolist: { name: string; id: number; ownerID: number }) => (
            <div
              key={todolist.id}
              onClick={async () => {
                selectedTodolist = todolist;
                selectedTodolistItems = await fetch(
                  "/api/GetTodoListItems?listID=" + todolist.id
                ).then((res) => res.json());
              }}
            >
              <span>{todolist.name}</span>
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
      
      {selectedTodolist != null && (
        <todolist
          todos={selectedTodolistItems}
          name={selectedTodolist.name}
        />;
      )}
      
    </div>
  );
}
