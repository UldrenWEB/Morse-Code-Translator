import ListController from '../controllers/ListController.js';
import server from '../components/Server/index.js';

const listRouter = () => {
  const router = server.createRouterInstance();

  server.registerRouteWithMethod({
    path: '/list',
    method: 'get',
    router,
    handler: [ListController.listPortsAvailable],
  });

  return router;
};

export default listRouter;
