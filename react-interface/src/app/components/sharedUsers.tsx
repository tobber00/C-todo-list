"use client";

import { useState, useEffect } from "react";
import { Button, Stack, Box, Typography } from '@mui/material';

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
        <Box>
            <Typography variant="h6" component="h6">Shared with:</Typography>
            {SharedUsers.map((username: string) => (
                <Stack key={username} direction="row" spacing={2} justifyContent="space-between">
                    <Typography variant="subtitle1" component="p">{username}</Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
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
                      X
                    </Button>
                </Stack>
            ))}
        </Box>
    );
}