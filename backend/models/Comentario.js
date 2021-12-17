const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let comentarioSchema = new Schema({
  cita: {
    type: Object
  },
  comentario: {
    type: String
  },
  creado: {
    type: Date
  },
  actualizado: {
    type: Date
  }
}, {
    collection: 'comentario'
  })

module.exports = mongoose.model('Comentario', comentarioSchema)