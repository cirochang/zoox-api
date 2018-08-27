const mongoose = require('mongoose');
const mongooseApiQuery = require('mongoose-api-query');

const { Schema } = mongoose;

const CitySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  stateId: {
    type: Schema.Types.ObjectId,
    ref: 'State',
    required: true,
  },
}, {
  timestamps: true,
});
CitySchema.plugin(mongooseApiQuery);
module.exports = mongoose.model('City', CitySchema);
