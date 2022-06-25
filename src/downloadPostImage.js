// @ts-check

const fs = require("fs");
const { default: fetch } = require("node-fetch");

const checkStatus = require("./checkStatus");

/**
 * @param {Object} input
 * @param {string} input.username
 * @param {ProgressBar} input.bar
 * @param {any} input.post
 */
const downloadPostImage = async ({ post, username, bar }) => {
  const { imageHQ, code } = post;
  const imagePath = `data/${username}/images/${code}.jpg`;
  if (fs.existsSync(imagePath)) {
    bar.tick();
    return;
  }
  // Because I'm not awaiting outside, I have
  // to use a try/catch here.
  try {
    const response = await fetch(imageHQ);
    checkStatus(response);
    const destination = fs.createWriteStream(imagePath);
    response.body.pipe(destination);
    destination.on("error", (error) => {
      throw error;
    });
    destination.on("close", (error) => {
      if (error) throw error;
      bar.tick();
    });
  } catch (error) {
    console.error(
      `Something went wrong while downloading the file ${code}: ${error}`
    );
  }
};

module.exports = downloadPostImage;
