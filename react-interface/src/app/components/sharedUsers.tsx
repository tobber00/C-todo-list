"use client";

import { useState, useEffect } from "react";

export default function SharedUsers({
  users,
  listID,
  setSharedUsersData,
}: {
  users: { data: string[] };
  listID: string;
  setSharedUsersData: React.Dispatch< React.SetStateAction<{ data: string[] }> >;
}) {
    const [SharedUsers, setSharedUsers] = useState(users.data);

    useEffect(() => {
        setSharedUsers(users.data);
    }, [users.data]);

    return (
        <div>
            <p>Shared with:</p>
            {SharedUsers.map((username: string) => (
                <div key={username}>
                    <span>{username}</span>
                    <button
                      className="bg-red-400"
                      onClick={() => {
                        fetch("/api/UnshareTodoList", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ listID: listID, username: username }),
                        }).then(() => {
                          setSharedUsers(SharedUsers.filter(user => user !== username));
                          setSharedUsersData({data: SharedUsers.filter(user => user !== username)});
                        });
                        }}
                    >
                      Unshare
                    </button>
                </div>
            ))}
        </div>
    );
}