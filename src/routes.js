import { Router } from 'express';
import multer from 'multer';

import {
  UserController,
  SessionController,
  FileController,
} from './app/controllers';

import multerConfig from './config/multer';
import auth from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);

routes.post('/session', SessionController.store);

routes.use(auth);

routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
