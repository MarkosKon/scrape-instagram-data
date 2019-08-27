const get = require("lodash.get");

module.exports = ({ user }) => ({
  id: get(user, "id"),
  biography: get(user, "biography"),
  username: get(user, "username"),
  fullname: get(user, "full_name"),
  avatar: get(user, "profile_pic_url"),
  avatarHigh: get(user, "profile_pic_url_hd"),
  isVerified: get(user, "is_verified"),
  externalUrl: get(user, "external_url"),
  followers: get(user, "edge_followed_by.count"),
  following: get(user, "edge_follow.count"),
  postCount: get(user, "edge_owner_to_timeline_media.count")
});
