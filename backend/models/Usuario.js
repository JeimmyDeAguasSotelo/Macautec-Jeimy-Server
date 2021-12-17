const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let usuarioSchema = new Schema({
  nombre: {
    type: String
  },
  email: {
    type: String
  },
  telefono: {
    type: String
  },
  cedula: {
    type: String
  },
  fechanacimiento:{
    type: Date
  },
  tipo: {
    type: String
  },
  password: {
    type: String
  },
  creado: {
    type: Date
  },
  actualizado: {
    type: Date
  }
},
 
{
    collection: 'usuario'
},
{
    timestamps: true
});
usuarioSchema.methods.toJSON = function(){
  var obj = this.toObject();
  delete obj.password;

  return obj;
}

module.exports = mongoose.model('Usuario', usuarioSchema)