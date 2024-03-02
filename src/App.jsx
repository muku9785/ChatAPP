import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [socketID, setSocketID] = useState("");
  
  const socketRef = useRef(null);
 
  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    socketRef.current.on("broaddata", (data) => {
      setSocketID(socketRef.current.id);
      console.log(data);
      setMessages(prevMessages => [...prevMessages, data]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (socketRef.current) {
      socketRef.current.emit("message", { room, message });
      setMessage("");
    }
  };

  return (
    <div> 
      <div>
        <Container maxWidth="sm">
          <Typography variant="h2" component="div" gutterBottom>
           
          </Typography>
          <h1>Socket.io chat app</h1>
          <Stack>
            {messages.map((m, i) => (
              <Typography key={i} variant="h6" className="messageDiv" component="div" gutterBottom>
                {m}
              </Typography>
            ))}
          </Stack>
          <form onSubmit={handleChange}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary">
              Send
            </Button>
          </form>

         
        </Container>
      </div>
    </div>
  );    
}

export default App;
