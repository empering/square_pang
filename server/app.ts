import * as express from 'express';
import { json, urlencoded } from 'body-parser';
import * as path from 'path';
import * as cors from 'cors';
import * as compression from 'compression';
import * as mongoose from 'mongoose';

import { loginRouter } from './routes/login';
import { protectedRouter } from './routes/protected';
import { publicRouter } from './routes/public';
import { feedRouter } from './routes/feed';
import { userRouter } from './routes/user';

const app: express.Application = express();

app.disable('x-powered-by');

app.use(json());
app.use(compression());
app.use(urlencoded({ extended: true }));

// api routes
app.use('/api/secure', protectedRouter);
app.use('/api/login', loginRouter);
app.use('/api/public', publicRouter);
app.use('/api/feed', feedRouter);
app.use('/api/user', userRouter);

// if (app.get('env') === 'production') {

  // in production mode run application from dist folder
  // app.use(express.static(path.join(__dirname, '/../client')));
  // app.use('/public', express.static(path.join(__dirname, '/../client')));
  app.use(express.static(path.join(__dirname, '/../client')));
// }

// catch 404 and forward to error handler
app.use(function(req: express.Request, res: express.Response, next) {
  let err = new Error('Not Found');
  next(err);
});

console.log(process.env.MONGODB_URI);
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://heroku_k6x59fzc:heroku_k6x59fzc@ds141108.mlab.com:41108/heroku_k6x59fzc');

// production error handler
// no stacktrace leaked to user
app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {

  res.status(err.status || 500);
  res.json({
    error: {},
    message: err.message
  });
});

export { app }
