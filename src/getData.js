const fetch = require("node-fetch");
const get = require("lodash.get");
const ProgressBar = require("progress");

const getPosts = require("./getPosts");
const downloadPostImage = require("./downloadPostImage");
const mapUserData = require("./mapUserData");
const mapPosts = require("./mapPosts");

const bar = new ProgressBar(
  "Downloading instagram posts [:bar] :current/:total :elapsed secs :percent",
  {
    total: 0,
    width: 30
  }
);

module.exports = async (username, limit) => {
  const url = `https://www.instagram.com/${username}/?__a=1`;

  const response = await fetch(url);
  const json = await response.json();
  const rawData = json.graphql;

  const userData = mapUserData(json.graphql);
  bar.total = userData.postCount;

  const posts = mapPosts(rawData);
  posts.forEach(post => downloadPostImage({ post, username, bar }));

  const endCursor = get(
    rawData,
    "user.edge_owner_to_timeline_media.page_info.end_cursor"
  );
  if (endCursor) {
    const downloadedSoFar = posts.length;
    return {
      userData,
      posts: await getPosts({
        lastPageId: endCursor,
        userId: userData.id,
        username,
        bar,
        result: posts,
        limit,
        downloadedSoFar
      })
    };
  }
  return {
    userData,
    posts
  };
};
