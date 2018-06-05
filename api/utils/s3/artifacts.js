const aws = require('aws-sdk');

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_KEY,
  accessKeyId: process.env.AWS_KEY_ID,
  region: process.env.AWS_REGION,
  signatureVersion: 'v4',
});

const s3 = new aws.S3({ params: { Bucket: process.env.AWS_S3_ARTIFACTS_BUCKET } });
const S3Uri = `https://s3.amazonaws.com/${process.env.AWS_S3_ARTIFACTS_BUCKET}/`;


exports.uploadToS3 = (file, destFileName) =>
  s3.upload({
    ACL: 'public-read',
    Body: file.buffer,
    Key: destFileName.toString(),
    ContentType: 'application/octet-stream',
  }).promise();


exports.hasS3Uri = uri => uri.includes(S3Uri);

exports.addS3Uri = path => (path ? `${S3Uri}${path}` : null);

exports.removeS3Uri = uri => uri.split(S3Uri).pop();
