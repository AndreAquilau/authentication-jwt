import '../config/env';
import 'reflect-metadata';
import database from '../database/index';
import app from './app';

database
  .then(() => {
    console.log(`Connection DataBase Success`);
    app.emit('ServerOn');
  })
  .catch(() => {
    console.log('Bad Connection DataBase');
  });

app.on('ServerOn', () => {
  app.listen(process.env.PORT, () => {
    if (process.env.MODE === 'development') {
      console.log(`${process.env.BASE_URL}:${process.env.PORT}`);
    }
    if (process.env.MODE === 'production') {
      console.log(`Server Production On`);
    }
  });
});
