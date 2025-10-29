"use server";
import { auth } from "@/auth";
import Content from "./todolist";
import SignIn from "./components/sign-in";
import Overview from "./overview";

export default async function Home() {
  const session = await auth();
  //let data = await fetch("http://localhost:8000/GetTodoList");
  //let todos = await data.json();
  //<Content todos={todos} />
  var user = null;
  var todolists = null;

  if (session) {
    user = await fetch("http://localhost:8000/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        type: session.user.type,
        provider: session.user.provider,
      }),
    }).then((res) => res.json());
    console.log("fetched user", user);
  }

  if (user != null) {
    todolists = await fetch(
      "http://localhost:8000/GetTodoLists?ownerID=" + user.id
    ).then((res) => res.json());
  }

  return (
    <>
      {session ? (
        <>
          <span>Signed in as {user.name}</span>
          <Overview todolistsInput={todolists} userID={user.id} />
        </>
      ) : (
        <SignIn />
      )}
    </>
  );
}
