const { addS3Uri } = require('../utils/s3/artifacts');

const addS3UriOnDownloads = artifact =>
  (artifact.download ? addS3Uri(artifact.download) : null);

exports.prepareArtifact = artifact =>
  ({
    ...artifact,
    download: addS3UriOnDownloads(artifact),
  });

exports.groupVersionsByOs = artifacts => ({
  android: artifacts ? artifacts.filter(artifact => artifact.os === 'android') : [],
  ios: artifacts ? artifacts.filter(artifact => artifact.os === 'ios') : [],
});
