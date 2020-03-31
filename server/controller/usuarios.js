const express = require('express');
const Usuario = require('../models/usuario');
const app = express();

const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/usuario', (req, res) => {
  res.json('get usuario');
});

app.post('/usuario', (req, res) => {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    rol: body.rol
  });

  usuario.save((err, usuarioDb) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDb
    });
  });
});

app.put('/usuario/:id', (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['nombre', 'email', 'img', 'rol', 'estado']);

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, usuarioDb) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        usuario: usuarioDb
      });
    }
  );
});

app.delete('/usuario', (req, res) => {
  res.json('delete usuario');
});

module.exports = app;
