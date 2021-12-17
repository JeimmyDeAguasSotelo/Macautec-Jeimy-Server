let mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router();
var cors = require('cors')
router.use(cors())
// Modelo Cita
let citaSchema = require('../models/Cita');

// CREAR Cita
router.route('/crear-cita').post((req, res, next) => {
  
  citaSchema.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      console.log(data)
      res.json(data)
    }
  })
});

router.route('/').get((req, res) => {
  
  citaSchema.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  }).sort({ actualizado: -1 })
})

router.route('/servicio-mas-solicitado').get((req, res) => {
  
  citaSchema.aggregate(
    [
      { 
        $group: { _id: '$servicio.nombre', 
          conteo: { $sum: 1 } 
        }
      }
    ,    
      {
        $sort: { conteo: -1 }
      }
    ],(error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


router.route('/servicio-mas-solicitado/:inicio/:fin').get((req, res) => {
  
  //console.log('req.params.inicio: '+req.params.inicio+', req.params.fin: '+req.params.fin )
  var fechafinal = new Date(req.params.fin);
  fechafinal.setDate(fechafinal.getDate() + 1);
  var fechainicio = new Date(req.params.inicio)
  //console.log('fechainicio: '+fechainicio+', fechafinal: '+fechafinal )
  citaSchema.aggregate(
    [
      { $match: {          
        fecha: {$gte: fechainicio, $lt: fechafinal}
        }
      },
      { 
        $group: { _id: '$servicio.nombre', 
          conteo: { $sum: 1 } 
        }
      }
    ,    
      {
        $sort: { conteo: -1 }
      }
    ],(error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


router.route('/servicio-menos-solicitado/:inicio/:fin').get((req, res) => {
  
  var fechafinal = new Date(req.params.fin);
  fechafinal.setDate(fechafinal.getDate() + 1);

  citaSchema.aggregate(
    [
        { $match: {          
          fecha: {$gte: new Date(req.params.inicio), $lt: fechafinal}
        }
      },
      { 
        $group: { _id: '$servicio.nombre', 
          conteo: { $sum: 1 } 
        }
      }
    ,    
      {
        $sort: { conteo: 1 }
      }
    ],(error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

router.route('/servicio-menos-solicitado').get((req, res) => {
  
  citaSchema.aggregate(
    [
      { 
        $group: { _id: '$servicio.nombre', 
          conteo: { $sum: 1 } 
        }
      }
    ,    
      {
        $sort: { conteo: 1 }
      }
    ],(error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

router.route('/servicios-mecanico-por-dia/:inicio/:fin').get((req, res) => {
  
  var fechafinal = new Date(req.params.fin);
  fechafinal.setDate(fechafinal.getDate() + 1);
  citaSchema.aggregate(
    [
        { $match: {          
            fecha: {$gte: new Date(req.params.inicio), $lt: fechafinal}
          }
        },
        { 
          $group: { 
          '_id': { fecha : '$fecha', mecanico : '$mecanico.nombre'},          
          'citas': { $push: {'servicio':'$servicio','estado' : '$estado', 'cliente' : '$cliente', 'telefono' : '$telefono', 'placavehiculo' : '$placavehiculo', 'hora' : '$hora' } }
          }
        },
        { $sort: { _id: -1 } }

    ],(error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


router.route('/servicios-mecanico-por-dia').get((req, res) => {
  
  citaSchema.aggregate(
    [       
        { 
          $group: { 
          '_id': { fecha : '$fecha', mecanico : '$mecanico.nombre'},          
          'citas': { $push: {'estado' : '$estado', 'cliente' : '$cliente', 'telefono' : '$telefono', 'placavehiculo' : '$placavehiculo', 'hora' : '$hora' } }
          }
        },
        { $sort: { _id: -1 } }

    ],(error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

router.route('/servicios-completos/:inicio/:fin').get((req, res) => {
  
  
  var fechafinal = new Date(req.params.fin);
  fechafinal.setDate(fechafinal.getDate() + 1);

  citaSchema.aggregate(
    [ { $match : { estado : "Completo", fecha: {$gte: new Date(req.params.inicio), $lt: fechafinal } } }, { $group: { _id: null, conteo: { $sum: 1 } } } ]
    ,(error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

router.route('/servicios-completos').get((req, res) => {
  
  citaSchema.aggregate(
    [ { $match : { estado : "Completo" } }, { $group: { _id: null, conteo: { $sum: 1 } } } ]
    ,(error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Obtener las Citas de un servicio
router.route('/servicio/:id').get((req, res) => {
  
  citaSchema.find({ 'servicio._id' : req.params.id },(error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Obtener las Citas de un mecanico
router.route('/mecanico/:id').get((req, res) => {
  
  citaSchema.find({ 'mecanico._id' : req.params.id },(error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Obtener las Citas agrupadas por fecha
router.route('/porfecha/').get((req, res) => {
  
  citaSchema.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  }).sort({ fecha: -1 })
})

// Obtener unico Cita
router.route('/editar-cita/:id').get((req, res) => {
  
  citaSchema.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Editar Cita
router.route('/editar-cita/:id').put((req, res, next) => {
  
  citaSchema.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Cita editada correctamente !')
    }
  })
})

// Borrar Cita
router.route('/borrar-cita/:id').delete((req, res, next) => {
  
  citaSchema.findByIdAndRemove(req.params.id, (error, data) => {
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