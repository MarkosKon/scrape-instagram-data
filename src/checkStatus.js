// @ts-check

/**
 * @param {import("node-fetch").Response} response
 */
const checkStatus = (response) => {
  // res.status >= 200 && res.status < 300
  if (response.ok) return response;
  else throw Error(response.statusText);
};

module.exports = checkStatus;
