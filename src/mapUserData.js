// @ts-check

const get = require("lodash.get");

/**
 *
 * @param {Object} input
 * @param {Object} input.user
 * @param {string} input.user.id
 * @param {string} input.user.biography
 * @param {string} input.user.username
 * @param {string} input.user.full_name
 * @param {string} input.user.profile_pic_url
 * @param {string} input.user.profile_pic_url_hd
 * @param {boolean} input.user.is_verified
 * @param {boolean} input.user.external_url
 * @param {Object} input.user.edge_followed_by
 * @param {number} input.user.edge_followed_by.count
 * @param {Object} input.user.edge_follow
 * @param {number} input.user.edge_follow.count
 * @param {Object} input.user.edge_owner_to_timeline_media
 * @param {number} input.user.edge_owner_to_timeline_media.count
 */
const mapUserData = ({ user }) => ({
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
  postCount: get(user, "edge_owner_to_timeline_media.count"),
});

module.exports = mapUserData;
