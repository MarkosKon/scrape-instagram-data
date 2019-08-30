const get = require("lodash.get");
const fetch = require("node-fetch");

const downloadPostImage = require("./downloadPostImage");
const mapPosts = require("./mapPosts");
const checkStatus = require("./checkStatus");

const getPosts = async ({
  lastPageId,
  userId,
  username,
  bar,
  result,
  limit,
  downloadedSoFar
}) => {
  const pageSize = limit ? limit - downloadedSoFar : 1000; // max is 50 anyway.
  const url = `https://www.instagram.com/graphql/query/?query_hash=472f257a40c653c64c666ce877d59d2b&variables={"id":"${userId}","first":${pageSize},"after":"${lastPageId}"}`;

  const response = await fetch(url);
  // or const response = await fetch(url).then(res => checkStatus(res));
  checkStatus(response);
  const json = await response.json();

  const rawData = json.data;
  const newPosts = mapPosts(rawData);

  for (const post of newPosts) {
    downloadPostImage({ post, username, bar });
  }
  // newPosts.forEach(post => downloadPostImage({ post, username, bar }));

  const endCursor = get(
    rawData,
    "user.edge_owner_to_timeline_media.page_info.end_cursor"
  );
  const currentResult = result.concat(newPosts);
  if (endCursor)
    // This is a tail call recursion—using
    // a reducer—so it doesn't matter if we
    // "await" or not; in the end, all functions
    // will return the currentResult which is a value.
    // If the caller awaits... If not will be wrapped in
    // a promise. In our case, the caller is the index.js.
    //
    // There is an ESLint rule for that. It says that
    // indeed there's no difference, and we should not
    // "return await" because the return value of the async
    // function will always be a promise. We "return await"
    // only in try/catch blocks because if we don't, we
    // won't catch the error.
    // https://eslint.org/docs/rules/no-return-await
    // Also, it doesn't seem to create a performance problem if
    // you "return await", as the eslint rule suggests:
    // https://stackoverflow.com/questions/38708550/difference-between-return-await-promise-and-return-promise
    return await getPosts({
      lastPageId: endCursor,
      userId,
      username,
      bar,
      result: currentResult,
      limit,
      downloadedSoFar: currentResult.length
    });
  return currentResult;
};

module.exports = getPosts;
