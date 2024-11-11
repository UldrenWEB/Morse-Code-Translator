import { config } from 'dotenv';
config();
import server from './components/Server/index.js';
import cors from 'cors';
import indexRouter from './routes/index.js';
import Socket from './components/Socket/Server.js';
import listenSerialPort from './services/received/receivedMorse.js';

const { PORT } = process.env;
const app = server.app;
export const socketServer = new Socket(app);
const serverWithSocket = socketServer.getServer();

listenSerialPort();
server.enableJsonMiddleware();
server.enableUrlEncodedMiddleware();
server.addCustomMiddleware({ middleware: cors() });
server.registerRoute({
  path: '/api',
  router: indexRouter(),
});

socketServer.connect();
serverWithSocket.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
