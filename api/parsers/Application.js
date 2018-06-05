const {
  uploadToS3, hasS3Uri, addS3Uri, removeS3Uri,
} = require('../utils/s3/images');
const { prepareArtifact } = require('./Artifacts');
const Vibrant = require('node-vibrant');


const isBase64 = (str) => {
  // Check is base 64
  const regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
  return (str && !!str.match(regex));
};

const extension = imageBinary =>
  // Return extension type of a binary
  imageBinary.substring('data:image/'.length, imageBinary.indexOf(';base64'));

const generateS3Path = async (image, appId, fileName) => {
  // Upload and generate the s3 path of image  (binary or uri)
  if (hasS3Uri(image)) {
    return removeS3Uri(image);
  }
  if (isBase64(image)) {
    const destFile = `${appId}/${fileName}.${extension(image)}`;
    await uploadToS3(image, destFile);
    return destFile;
  }
  return null;
};

const generateGradients = async (image) => {
  // Return the two most vibrant colors of a image (binary or uri)
  const getVibrantColors = async (src) => {
    const palette = await Vibrant.from(src).getPalette();
    const firstColor = palette.Vibrant.getHex();
    const secondColor = palette.Muted ? palette.Muted.getHex() : palette.DarkVibrant.getHex();
    return [firstColor, secondColor];
  };
  if (isBase64(image)) {
    const buffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    return getVibrantColors(buffer);
  } else if (hasS3Uri(image)) {
    return getVibrantColors(image);
  }
  return [];
};

exports.uploadImages = async (images, appId) =>
  // Upload and prepare images path to save in database
  ({
    thumb: images.thumb ? await generateS3Path(images.thumb, appId, 'thumb') : null,
    gradients: images.thumb ? await generateGradients(images.thumb) : [],
    screenshots: await Promise.all(images.screenshots.map(async (screen, index) =>
      generateS3Path(screen, appId, `screenshot${index}`))),
  });

const addS3UriOnImages = (app) => {
  // Add S3 uri on images path of an app
  const getPaths = images => ({
    thumb: images.thumb ? addS3Uri(images.thumb) : '',
    screenshots: images.screenshots
      ? images.screenshots.map(addS3Uri)
      : [],
    gradients: images.gradients,
  });
  return (app.images) ? getPaths(app.images) : null;
};

const prepareCurrentVersions = (app) => {
  const android = (app.currentVersions && app.currentVersions.android)
    ? prepareArtifact(app.currentVersions.android)
    : null;
  const ios = (app.currentVersions && app.currentVersions.ios)
    ? prepareArtifact(app.currentVersions.ios)
    : null;
  return { android, ios };
};

exports.prepareApp = app => ({
  ...app,
  currentVersions: prepareCurrentVersions(app),
  images: addS3UriOnImages(app),
});
