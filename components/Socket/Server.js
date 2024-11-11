import { Server } from 'socket.io';
import { createServer } from 'node:http';

class SocketServer {
  constructor(app) {
    this.io = null;
    this.server = this.#createServer(app);
  }

  #createServer = (app) => {
    try {
      const server = createServer(app);
      this.io = new Server(server, {
        connectionStateRecovery: {
          maxDisconnectionDuration: 200000,
        },
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
          credentials: true,
        },
      });

      return server;
    } catch (error) {
      console.error('Error creating server:', error.message);
      return { error: error.message };
    }
  };

  connect = () => {
    if (this.io) {
      this.io.on('connection', this.#onConnection);
    } else {
      console.error('Socket.io instance is not initialized.');
    }
  };

  getServer = () => this.server;

  #onConnection = (socket) => {
    try {
      socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
      });
    } catch (error) {
      console.error('Error handling connection:', error.message);
    }
  };

  sendMessage = (event, message, socketId = null) => {
    try {
      if (socketId) {
        this.io.to(socketId).emit(event, message);
      } else {
        this.io.emit(event, message);
      }
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  };
}

export default SocketServer;
