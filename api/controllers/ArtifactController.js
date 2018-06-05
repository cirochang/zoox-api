const CDAP_API = require('../gateways/cdap_api');
const { uploadToS3 } = require('../utils/s3/artifacts');
const { prepareArtifact, groupVersionsByOs } = require('../parsers/Artifacts');

exports.create = async (req, res) => {
  const extension = req.body.os === 'android' ? 'apk' : 'ipa';
  const destFileName = `${req.body.applicationId}/${req.body.version}.${extension}`;
  await uploadToS3(req.file, destFileName);
  const artifact = { ...req.body, download: destFileName };
  const data = await CDAP_API.rpc('version', 'VersionService.Create', artifact, req.headers.token);
  return res.send(data);
};

exports.update = async (req, res) => {
  if (req.file) {
    const extension = req.body.os === 'android' ? '.apk' : '.ipa';
    const destFileName = `${req.body.applicationId}/${req.body.version}.${extension}`;
    await uploadToS3(req.file, destFileName);
    req.body.download = destFileName;
  }
  const artifact = { ...req.body, id: req.params.id };
  const data = await CDAP_API.rpc('version', 'VersionService.Update', artifact, req.headers.token);
  return res.send(data);
};

exports.delete = async (req, res) => {
  const data = await CDAP_API.rpc('version', 'VersionService.Delete', req.params, req.headers.token);
  return res.send(data);
};

exports.show_by_application_id = async (req, res) => {
  const data = await CDAP_API.rpc('version', 'VersionService.GetAllFromApplication', req.params, req.headers.token);
  data.versions = data.versions ? data.versions.map(prepareArtifact) : [];
  data.versions = groupVersionsByOs(data.versions);
  return res.send(data);
};
