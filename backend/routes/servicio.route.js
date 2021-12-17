let mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router();
  var cors = require('cors')
  router.use(cors())
// Modelo Servicio
let servicioSchema = require('../models/Servicio');

// CREAR Servicio
router.route('/crear-servicio').post((req, res, next) => {
  
  servicioSchema.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      console.log(data)
      res.json(data)
    }
  })
});


// Obtener todos los Servicios
router.route('/').get((req, res) => {
  
  servicioSchema.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  }).sort({ actualizado: -1 })
})

// Obtener todos los Servicios Activos
router.route('/activos').get((req, res) => {
  
  servicioSchema.find({ estado: 'Disponible' },(error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Obtener unico Servicio
router.route('/editar-servicio/:id').get((req, res) => {
  
  servicioSchema.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Editar Servicio
router.route('/editar-servicio/:id').put((req, res, next) => {
  
  servicioSchema.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Servicio editado correctamente !')
    }
  })
})

// Borrar Servicio
router.route('/borrar-servicio/:id').delete((req, res, next) => {
  
  servicioSchema.findByIdAndRemove(req.params.id, (error, data) => {
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