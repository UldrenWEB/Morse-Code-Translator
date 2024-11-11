import server from '../components/Server/index.js';
import routers from './index.routers.js';
import errorHandler from '../services/errorHandler/index.js';

const indexRouter = () => {
  const router = server.createRouterInstance();

  server.registerMultipleRouters({
    basePath: '/',
    baseRouter: router,
    routerConfigs: routers,
  });

  server.addCustomMiddleware({
    router,
    middleware: async (error, _req, res, _next) => {
      await errorHandler.handleError(error, res);
    },
  });

  return router;
};

export default indexRouter;
