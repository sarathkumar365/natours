const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception ... Shutting Down');
  console.log(err);
  process.exit(1);
});

const app = require('./app');

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('CONNECTED TO LOCAL DATABASE'));

const port = 3000;
const server = app.listen(port, () => {
  console.log(`started listening at ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection ... Shutting Down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
