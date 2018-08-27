const { Router } = require('express');

module.exports = function(app) {
  const auth = require('../controllers/Auth');
  const state = require('../controllers/StateController');
  const city = require('../controllers/CityController');

  const apiV1 = Router();
  app.use('/api/v1', apiV1);

  // STATES
  apiV1.route('/states')
    .get(auth.authorize, state.show_all)
    .post(auth.authorize, state.create);

  apiV1.route('/states/:stateId')
    .get(auth.authorize, state.show)
    .delete(auth.authorize, state.delete)
    .put(auth.authorize, state.update);

  // CITIES
  apiV1.route('/cities')
    .get(auth.authorize, city.show_all)
    .post(auth.authorize, city.create);

  apiV1.route('/cities/:cityId')
    .get(auth.authorize, city.show)
    .delete(auth.authorize, city.delete)
    .put(auth.authorize, city.update);
};