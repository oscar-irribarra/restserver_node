const express = require('express');
const Usuario = require('../models/usuario');
const app = express();

const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/usuario', (req, res) => {
  const desde = Number(req.query.desde) || 0;
  const limite = Number(req.query.limite) || 5;

  Usuario.find({ estado: true }, 'nombre email role google rol')
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) return res.status(400).json({ ok: false, err });

      Usuario.count({}, (err, conteo) => {
        res.json({ ok: true, usuarios, conteo });
      });
    });
});

app.post('/usuario', (req, res) => {
  const body = req.body;
  const usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    rol: body.rol,
  });

  usuario.save((err, usuarioDb) => {
    if (err) return res.status(400).json({ ok: false, err });

    res.json({ ok: true, usuario: usuarioDb });
  });
});

app.put('/usuario/:id', (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['nombre', 'email', 'img', 'rol', 'estado']);

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, usuarioDb) => {
      if (err) return res.status(400).json({ ok: false, err });

      res.json({ ok: true, usuario: usuarioDb });
    }
  );
});

app.delete('/usuario/:id', (req, res) => {
  const id = req.params.id;
  const cambiarEstado = { estado: false };
  // Usuario.findByIdAndRemove(id, (err, borrado) => {
  Usuario.findByIdAndUpdate(
    id,
    cambiarEstado,
    { new: true },
    (err, borrado) => {
      if (err) return res.status(400).json({ ok: false, err });

      if (!borrado)
        return res
          .status(400)
          .json({ ok: false, err: 'Usuario no encontrado' });

      res.json({ ok: true, borrado });
    }
  );
});

module.exports = app;
