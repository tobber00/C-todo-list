"use client";

import { useState } from "react";
import Todo from "./components/todo";

export default function Content({
  todos,
  name,
}: {
  todos: {
    data: { id: number; task: string; completed: boolean }[];
  };
  name: string;
}) {
  const [todoList, setTodoList] = useState(todos.data);
  return (
    <div>
      <p>Make new todo:</p>
      <input type="text" placeholder="Type here" />
      <button
        className="bg-blue-400"
        onClick={() => {
          let input = document.querySelector("input");
          fetch("/api/AddTodo", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ task: input?.value }),
          })
            .then((res) => res.json())
            .then((todo) => setTodoList([...todoList, todo.data]));
          input!.value = "";
        }}
      >
        Create
      </button>

      <p>{name}</p>
      <div>
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
      </div>

      <button
        className="bg-blue-400"
        onClick={() =>
          fetch("/api/ClearTodo", {
            method: "DELETE",
          }).then(() => setTodoList([]))
        }
      >
        Clear todo-list
      </button>
    </div>
  );
}
