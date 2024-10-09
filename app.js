import express from 'express';

const PORT_NUMBER = 6969;
const app = express();

app.use('/', express.static('./public'));


app.listen(PORT_NUMBER, () => {
  console.log(`Listening on port ${PORT_NUMBER}...`);
});