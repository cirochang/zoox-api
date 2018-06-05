const axios = require('axios');
const humps = require('humps');

// snake_case the body,
// make request to rpc of microservices
// and return the response data in camelCase.
exports.rpc = async (service, method, request, token) => {
  const response = await axios.create({
    baseURL: `${process.env.CDAP_API_URI}:${process.env.CDAP_API_PORT}`,
    headers: {
      token,
    },
  }).post('/rpc', { service, method, request: humps.decamelizeKeys(request) });
  return humps.camelizeKeys(response.data);
};
