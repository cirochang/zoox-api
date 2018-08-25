const mongoose = require('mongoose');
const City = mongoose.model('City');

exports.create = function(req, res){
  const city = new City(req.body);
  city.save(function(err, city) {
    if (err)
      return res.send(400, err);
    return res.sendStatus(200);
  });
};

exports.delete = function(req, res) {
  City.deleteOne({_id: req.params.cityId}, function(err) {
    if(err)
      return res.send(400, err);
    return res.sendStatus(200);
  });
};

exports.update = function(req, res) {
  City.findOneAndUpdate({_id: req.params.cityId}, req.body, {new: true}, function(err, demand) {
    if (err)
      return res.send(400, err);
    return res.json(city);
  });
};

exports.show_all = function(req, res) {
  City.apiQuery(req.query).populate({path: 'cities', model: 'City'}).exec(function(err, cities) {
    if (err)
      return res.send(400, err);
    return res.json(cities);
  });
};