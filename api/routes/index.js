const user = require('../controllers/UserController');
const application = require('../controllers/ApplicationController');
const artifact = require('../controllers/ArtifactController');
const Joi = require('joi');
const { Router } = require('express');
const multer = require('multer');

// Use to catch errors from async functions
const asyncMiddleware = fn =>
  (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const validateBody = bodyKeys =>
  (req, res, next) => {
    const bodySchema = Joi.object().keys(bodyKeys);
    const { value, error } = Joi.validate(req.body, bodySchema);
    req.body = value;
    return error ? res.status(422).send({ error }) : next();
  };

const validateQuery = queryKeys =>
  (req, res, next) => {
    const querySchema = Joi.object().keys(queryKeys);
    const { value, error } = Joi.validate(req.query, querySchema);
    req.query = value;
    return error ? res.status(422).send({ error }) : next();
  };

module.exports = (app) => {
  // Just a healthcheck
  app.get('/', (req, res) => {
    res.sendStatus(200);
  });

  const v1Router = Router();
  app.use('/api/v1', v1Router);

  // Users Service
  v1Router.route('/current_user')
    .get(asyncMiddleware(user.currentUser));

  v1Router.route('/auth')
    .post(
      validateBody({
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().required(),
      }),
      asyncMiddleware(user.auth),
    );

  v1Router.route('/user/tutorial')
    .post(asyncMiddleware(user.seeTutorial));

  // Applications Service
  v1Router.route('/application')
    .get(
      validateQuery({
        search: Joi.string().allow(null).allow(''),
        page: Joi.number().allow(null),
        limit: Joi.number().allow(null),
        os: Joi.string().allow(null).allow(''),
      }),
      asyncMiddleware(application.show_all),
    )

    .post(
      validateBody({
        id: Joi.string().allow(null),
        name: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.string().required(),
        developer: Joi.string().allow(null),
        images: Joi.object({
          thumb: Joi.string().required(),
          gradients: Joi.array().items(Joi.string()).allow(null).default(null),
          cover: Joi.string().allow(null),
          screenshots: Joi.array().items(Joi.string()),
        }),
      }),
      asyncMiddleware(application.create),
    );

  v1Router.route('/application/:id')
    .get(asyncMiddleware(application.show))

    .put(
      validateBody({
        id: Joi.string().allow(null),
        name: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.string().required(),
        developer: Joi.string().allow(null),
        images: Joi.object({
          thumb: Joi.string().required(),
          gradients: Joi.array().items(Joi.string()).allow(null).default(null),
          cover: Joi.string().allow(null),
          screenshots: Joi.array().items(Joi.string()),
        }),
        user: Joi.object().allow(null),
        currentVersions: Joi.object().strip(),
        lastVersions: Joi.object().allow(null),
        createdAt: Joi.number().allow(null),
        updatedAt: Joi.number().allow(null),
      }),
      asyncMiddleware(application.update),
    )

    .delete(asyncMiddleware(application.delete));

  v1Router.route('/application/:applicationId/set_production_artifact')
    .post(
      validateBody({
        artifactId: Joi.string().required(),
      }),
      asyncMiddleware(application.change_production_artifact),
    );

  v1Router.route('/my_applications')
    .get(asyncMiddleware(application.show_my_applications));

  v1Router.route('/artifact')
    .post(
      multer().single('file'),
      validateBody({
        id: Joi.string().allow(null),
        packageName: Joi.string().required(),
        os: Joi.string().required(),
        version: Joi.string().required(),
        description: Joi.string().required().allow(''),
        minOsVersionRequirement: Joi.string().required(),
        applicationId: Joi.string().required(),
      }),
      asyncMiddleware(artifact.create),
    );

  v1Router.route('/artifact/homolog')
    .post(
      multer().single('file'),
      validateBody({
        id: Joi.string().allow(null),
        packageName: Joi.string().required(),
        os: Joi.string().required(),
        version: Joi.string().required(),
        description: Joi.string().required().allow(''),
        minOsVersionRequirement: Joi.string().required(),
        applicationId: Joi.string().required(),
      }),
      asyncMiddleware(artifact.createHomolog),
    );

  v1Router.route('/artifact/:id')
    .delete(asyncMiddleware(artifact.delete));

  v1Router.route('/my_artifacts/:application_id')
    .get(asyncMiddleware(artifact.show_by_application_id));
};
