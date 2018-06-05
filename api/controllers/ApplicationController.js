const CDAP_API = require('../gateways/cdap_api');
const { uploadImages, prepareApp } = require('../parsers/Application');

exports.create = async (req, res) => {
  // This route is wrong!! The correctly flow need to be:
  // [uploadImages] -> [Create application]
  // OBS: generate hash to save the path form images bucket (not the id from app).
  const application = {
    ...req.body,
    images: {
      thumb: null,
      gradients: [],
      screenshots: [],
    },
  };
  const data = await CDAP_API.rpc('crud', 'CrudService.Create', application, req.headers.token);
  req.params.id = data.app.id;
  req.body = { ...data.app, ...req.body };
  return this.update(req, res);
};

exports.update = async (req, res) => {
  // ATENTION, THE UPDATE FROM MICROSERVICES WILL BE UPDATED TO UPDATE ONLY THE
  // PARAMS PASS OF APPLICATION!
  const application = {
    ...req.body,
    id: req.params.id,
    images: await uploadImages(req.body.images, req.params.id),
  };
  const data = await CDAP_API.rpc('crud', 'CrudService.Update', application, req.headers.token);
  data.app = prepareApp(data.app);
  return res.send(data);
};

exports.show = async (req, res) => {
  const data = await CDAP_API.rpc('crud', 'CrudService.Get', req.params, req.headers.token);
  data.app = prepareApp(data.app);
  return res.send(data);
};

exports.show_my_applications = async (req, res) => {
  const data = await CDAP_API.rpc('crud', 'CrudService.GetAllCurrentUser', {}, req.headers.token);
  data.apps = data.apps ? data.apps.map(prepareApp) : [];
  return res.send(data);
};

exports.show_all = async (req, res) => {
  const data = await CDAP_API.rpc('crud', 'CrudService.GetAll', req.query, req.headers.token);
  data.apps = data.apps ? data.apps.map(prepareApp) : [];
  return res.send(data);
};

exports.delete = async (req, res) => {
  const data = await CDAP_API.rpc('crud', 'CrudService.Delete', req.params, req.headers.token);
  return res.send(data);
};

exports.change_production_artifact = async (req, res) => {
  const body = {
    app_id: req.params.applicationId,
    version_id: req.body.artifactId,
  };
  const data = await CDAP_API.rpc('crud', 'CrudService.SetCurrentVersion', body, req.headers.token);
  data.app = prepareApp(data.app);
  return res.send(data);
};
