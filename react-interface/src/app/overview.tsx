"use client";

import { useState } from "react";

export default function Overview({
  user,
}: {
  user: { email: string; emailVerified: string; id: string; name: string };
}) {
  return (
    <div>
      <p>Overview</p>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Email verified: {user.emailVerified}</p>
      <p>ID: {user.id}</p>
    </div>
  );
}
