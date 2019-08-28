const fs = require("fs");
const fetch = require("node-fetch");

module.exports = async ({ post, username, bar }) => {
  const { imageHQ, code } = post;
  const imagePath = `data/${username}/images/${code}.jpg`;
  if (fs.existsSync(imagePath)) {
    bar.tick();
    return;
  }
  const res = await fetch(imageHQ);
  const dest = fs.createWriteStream(imagePath);
  res.body.pipe(dest);
  bar.tick();
  dest.on("error", err => {
    throw err;
  });
};
