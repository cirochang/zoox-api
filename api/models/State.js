const mongoose = require('mongoose');
const mongooseApiQuery = require('mongoose-api-query');
const Schema = mongoose.Schema;

const StateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  abbreviation: {
    type: String,
    required: true,
  },
},{
  timestamps: true
});
StateSchema.plugin(mongooseApiQuery);
module.exports = mongoose.model('State', StateSchema);