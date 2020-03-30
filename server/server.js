require('./config/config');

const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require('./controller/usuarios'));

mongoose
  .connect('mongodb://localhost:27017/cafe', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(console.log('Base de datos Conectada...'))
  .catch(err => {
    console.log( err );
  });

app.listen(process.env.PORT, () => {
  console.log('Escuchando puerto:', process.env.PORT);
});
