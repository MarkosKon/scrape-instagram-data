const get = require("lodash.get");

module.exports = ({
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
