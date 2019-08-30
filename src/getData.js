const fetch = require("node-fetch");
const get = require("lodash.get");

const mapUserData = require("./mapUserData");
const mapPosts = require("./mapPosts");
const checkStatus = require("./checkStatus");

module.exports = async username => {
  const url = `https://www.instagram.com/${username}/?__a=1`;

  const response = await fetch(url);
  checkStatus(response);
  const json = await response.json();
  const rawData = json.graphql;

  const userData = mapUserData(rawData);
  const initialPosts = mapPosts(rawData);
  const endCursor = get(
    rawData,
    "user.edge_owner_to_timeline_media.page_info.end_cursor"
  );
  return {
    userData,
    initialPosts,
    endCursor
  };
};
