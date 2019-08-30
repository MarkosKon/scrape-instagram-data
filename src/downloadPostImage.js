const fs = require("fs");
const fetch = require("node-fetch");

const checkStatus = require("./checkStatus");

module.exports = async ({ post, username, bar }) => {
  const { imageHQ, code } = post;
  const imagePath = `data/${username}/images/${code}.jpg`;
  if (fs.existsSync(imagePath)) {
    bar.tick();
    return;
  }
  // Because I'm not awaiting outside, I have
  // to use a try/catch here.
  try {
    const res = await fetch(imageHQ);
    checkStatus(res);
    const dest = fs.createWriteStream(imagePath);
    res.body.pipe(dest);
    bar.tick();
    dest.on("error", err => {
      throw err;
    });
  } catch (e) {
    console.log(
      `Something went wrong while downloading the file ${code}: ${e}`
    );
  }
};
