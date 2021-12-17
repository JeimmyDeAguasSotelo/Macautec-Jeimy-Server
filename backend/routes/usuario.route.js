  let mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router();
  var cors = require('cors')
  router.use(cors())
// Modelo usuario
let usuarioSchema = require('../models/Usuario');

// CREAR Usuario
router.route('/crear-usuario').post((req, res, next) => {
  
  usuarioSchema.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      console.log(data)      
      res.json(data)
    }
  })
});

// Obtener todos los Usuarios
router.route('/').get((req, res) => {
  
  usuarioSchema.find((error, data) => {
    if (error) {
      return next(error)
    } else {      
      res.json(data)
    }
  }).sort({ actualizado: -1 })
})

// Obtener todos los Usuarios
router.route('/mecanicos').get((req, res) => {
  
  usuarioSchema.find({ tipo: 'Mecanico' },(error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Obtener unico Usuario
router.route('/editar-usuario/:id').get((req, res) => {
  //res2.set('Access-Control-Allow-Origin', '*');
  usuarioSchema.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Obtener unico Usuario por email y password
router.route('/login/').post((req, res) => {  
  
  let obj = { email: req.body.email, password: req.body.password };
  //console.log(obj)
  usuarioSchema.find(obj, (error, data) => {
    if (error) {
      return next(error)
    } else {
      
      if(JSON.stringify(data) === '[]'){
        obj = {
          token: '',
          usuario: [],
          login: false,
          error:'Usuario y/o contraseña incorrectos'
        }
        res.json(obj)
        //console.log(obj)
      }else{
        usr = {_id:data[0]._id,nombre:data[0].nombre,email:data[0].email,tipo:data[0].tipo}
        
        obj = {
          token: 'algunbonitotoken',
          usuario: usr,
          login: true
        }
        
        res.json(obj)
        //console.log(obj)
      }
      
    }
  })
})


// Editar Usuario
router.route('/editar-usuario/:id').put((req, res, next) => {
  
  usuarioSchema.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Usuario editado correctamente !')
    }
  })
})


// Borrar Usuario
router.route('/borrar-usuario/:id').delete((req, res, next) => {
  
  usuarioSchema.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = router;