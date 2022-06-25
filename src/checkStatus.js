const checkStatus = (res) => {
  // res.status >= 200 && res.status < 300
  if (res.ok) return res;
  else throw Error(res.statusText);
};

module.exports = checkStatus;
