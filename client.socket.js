import { io } from 'socket.io-client';

const socket = io('http://localhost:8080');

socket.on('connect', () => {
  console.log('Conectado al servidor de Socket.io');
  socket.on('message', (data) => {
    console.log('Mensaje recibido', data);
  });
});

socket.on('disconnect', () => {
  console.log('Desconectado del servidor de Socket.io');
});
