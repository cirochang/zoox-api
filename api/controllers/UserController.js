const CDAP_API = require('../gateways/cdap_api');

exports.currentUser = async (req, res) => {
  const data = await CDAP_API.rpc('user', 'UserService.GetCurrentUser', {}, req.headers.token);
  return res.send(data);
};

exports.auth = async (req, res) => {
  const data = await CDAP_API.rpc('authentication', 'AuthenticationService.Auth', req.body, null);
  return res.send(data);
};

exports.seeTutorial = async (req, res) => {
  const request = {
    show_tutorial: false,
  };
  const data = await CDAP_API.rpc('user', 'UserService.SetCurrentUserTutorial', request, req.headers.token);
  return res.send(data);
};
