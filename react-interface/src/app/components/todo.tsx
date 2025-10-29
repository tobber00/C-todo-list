"use client";

import { useState } from "react";

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
    <div key={todo.id}>
      <input
        type="checkbox"
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
      <span>{todo.task}</span>
      <button
        className="bg-red-400"
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
        Delete
      </button>
    </div>
  );
}
