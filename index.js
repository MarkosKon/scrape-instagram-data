const fs = require("fs");
const fetch = require("node-fetch");
const get = require("lodash.get");
const ProgressBar = require("progress");

// maybe add the option to get it
// from the program args?
const username = "emilia_clarke";
const pageSize = 1000; // max is 50 anyway.
let data = { userData: {}, posts: [] };

const bar = new ProgressBar(
  "Downloading instagram posts [:bar] :current/:total :elapsed secs :percent",
  {
    total: 0,
    width: 30
  }
);

const getPosts = async (lastPageId, userId) => {
  const firstRun = lastPageId === undefined;
  const url = firstRun
    ? `https://www.instagram.com/${username}/?__a=1`
    : `https://www.instagram.com/graphql/query/?query_hash=472f257a40c653c64c666ce877d59d2b&variables={"id":"${userId}","first":${pageSize},"after":"${lastPageId}"}`;

  const response = await fetch(url);
  const json = await response.json();

  if (firstRun) {
    data.userData = mapUserData(json.graphql);
    bar.total = get(data, "userData.postCount");
  }

  const rawData = firstRun ? json.graphql : json.data;

  const newPosts = mapPosts(rawData);
  newPosts.forEach(async post => {
    const res = await fetch(post.imageHQ);
    const dest = fs.createWriteStream(`./data/images/${post.code}.jpg`);
    res.body.pipe(dest);
    bar.tick();
  });

  data.posts = data.posts.concat(newPosts);
  // bar.tick(rawData.user.edge_owner_to_timeline_media.edges.length);

  const endCursor = get(
    rawData,
    "user.edge_owner_to_timeline_media.page_info.end_cursor"
  );
  if (endCursor) {
    await getPosts(endCursor, data.userData.id);
  }
};

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
  postCount: get(user, "edge_owner_to_timeline_media.count")
});

const mapPosts = ({
  user: {
    edge_owner_to_timeline_media: { edges }
  }
}) =>
  edges.map(({ node }) => {
    const textArray = get(node, "edge_media_to_caption.edges");
    const code = get(node, "shortcode");
    return {
      type: get(node, "__typename"),
      id: get(node, "id"),
      code,
      text:
        // textArray.length === 1
        //   ? textArray[0].node.text
        textArray.reduce((result, next) => result.concat(next.node.text), ""),
      textSize: node.edge_media_to_caption.edges.length,
      comments: get(node, "edge_media_to_comment.count"),
      likes: get(node, "edge_media_preview_like.count"),
      videoViews: get(node, "video_view_count"),
      location: get(node, "location"),
      image: `images/${code}.jpg`,
      imageHQ: get(node, "display_url"),
      imageThumbnail: get(node, "thumbnail_src"),
      a11yCaption: get(node, "accessibility_caption"),
      date: new Date(get(node, "taken_at_timestamp")).toISOString()
    };
  });

(async () => {
  await getPosts();
  fs.writeFileSync(
    `data/${username}-instagram-data-${new Date().getTime()}.json`,
    JSON.stringify(data, null, 2)
  );
})();
