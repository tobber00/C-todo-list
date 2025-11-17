"use client";

import { useState, useEffect } from "react";
import Todo from "./components/todo";
import SharedUsers from "./components/sharedUsers";

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

  return (
    <div>

      <p>Your Todolist: {todolistInput.name}</p>

      <p>Make new todo:</p>
      <input type="text" placeholder="Type here" name="taskInput"/>
      <button
        className="bg-blue-400"
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
      </button>

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
          fetch("/api/ClearTodo?listID=" + todolistInput.id.toString(), {
            method: "DELETE",
          }).then(() => setTodoList([]))
        }
      >
        Clear todo-list
      </button> 
      
      {!shared && (
      <>
        <p>Share todolist</p>
        <input type="text" placeholder="Type username here" name="shareInput"/>
        <button
          className="bg-blue-400"
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
        </button>
      
        <button
          className="bg-blue-400"
          onClick={async () => {
            if (sharedUsersData.data.length === 0) {
              var sharedUsersResponse = await fetch("/api/GetUsersWithSharedAccess?listID=" + todolistInput.id.toString());
              setSharedUsersData(await sharedUsersResponse.json());
            }
            setShowSharedUsers(!showSharedUsers);
          }}
        >
          show shared users
        </button>

        {showSharedUsers && 
        <SharedUsers 
        users={sharedUsersData} 
        listID={todolistInput.id.toString()}
        setSharedUsersData={setSharedUsersData}
        />}
      </>
    )}
    </div>
  );
}
