"use server";
import { auth } from "@/auth";
import Content from "./content";
import SignIn from "./components/sign-in";

export default async function Home() {
  const session = await auth();
  console.log("session", session);
  let data = await fetch("http://localhost:8000/GetTodoList");
  let todos = await data.json();
  console.log(todos);

  return (
    <>
      {session ? (
        <>
          <span>Signed in as {session.user?.email}</span>
          <Content todos={todos} />
        </>
      ) : (
        <SignIn />
      )}
    </>
  );
}
