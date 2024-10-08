import express from 'express';
const app = express();

app.use('/', express.static('./public'));

app.listen(6969, () => {
  console.log('Listening on port 3000...');
});