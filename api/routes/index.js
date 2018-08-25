const { Router } = require('express');

module.exports = function(app) {
  const state = require('../controllers/StateController');
  const city = require('../controllers/CityController');

  const apiV1 = Router();
  app.use('/api/v1', apiV1);

  // STATES
  apiV1.route('/states')
    .get(state.show_all)
    .post(state.create);

  apiV1.route('/states/:stateId')
    .delete(state.delete)
    .put(state.update);

  // CITIES
  apiV1.route('/cities')
    .get(city.show_all)
    .post(city.create);

  apiV1.route('/cities/:cityId')
    .delete(city.delete)
    .put(city.update);
};