const mongoose = require('mongoose');
const State = mongoose.model('State');

exports.create = function(req, res){
  const state = new State(req.body);
  state.save(function(err, state) {
    if (err)
      return res.send(400, err);
    return res.sendStatus(200);
  });
};

exports.delete = function(req, res) {
  State.deleteOne({_id: req.params.stateId}, function(err) {
    if(err)
      return res.send(400, err);
    return res.sendStatus(200);
  });
};

exports.update = function(req, res) {
  State.findOneAndUpdate({_id: req.params.stateId}, req.body, {new: true}, function(err, demand) {
    if (err)
      return res.send(400, err);
    return res.json(state);
  });
};

exports.show_all = function(req, res) {
  State.apiQuery(req.query).populate({path: 'states', model: 'State'}).exec(function(err, states) {
    if (err)
      return res.send(400, err);
    return res.json(states);
  });
};