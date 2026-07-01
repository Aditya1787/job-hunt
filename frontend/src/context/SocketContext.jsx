import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext.jsx';


const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
      setSocket(newSocket);

      // Notify server of client user identity
      newSocket.emit('register', user._id);


      // Listen for updated presence lists
      newSocket.on('online_users', (users) => {
        setOnlineUsers(users);
      });

      return () => {
        newSocket.disconnect();
      };
    } else {
      setSocket(null);
      setOnlineUsers([]);
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  return context;
};
