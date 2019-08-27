const get = require("lodash.get");
// const fs = require("fs");
const fetch = require("node-fetch");

const downloadPostImage = require("./downloadPostImage");
const mapPosts = require("./mapPosts");

const getPosts = async ({ lastPageId, userId, username, bar, result }) => {
  const pageSize = 1000; // max is 50 anyway.
  const url = `https://www.instagram.com/graphql/query/?query_hash=472f257a40c653c64c666ce877d59d2b&variables={"id":"${userId}","first":${pageSize},"after":"${lastPageId}"}`;

  const response = await fetch(url);
  const json = await response.json();

  const rawData = json.data;
  const newPosts = mapPosts(rawData);

  newPosts.forEach(post => downloadPostImage({ post, username, bar }));

  const endCursor = get(
    rawData,
    "user.edge_owner_to_timeline_media.page_info.end_cursor"
  );
  if (endCursor)
    return getPosts({
      lastPageId: endCursor,
      userId,
      username,
      bar,
      result: result.concat(newPosts)
    });
  return result.concat(newPosts);
};

module.exports = getPosts;
