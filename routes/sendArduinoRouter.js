import SendArduinoController from '../controllers/SendArduinoController.js';
import server from '../components/Server/index.js';

const sendArduinoRouter = () => {
  const router = server.createRouterInstance();

  server.registerRouteWithMethod({
    path: '/send',
    method: 'post',
    router,
    handler: [SendArduinoController.sendArduino],
  });

  return router;
};

export default sendArduinoRouter;
