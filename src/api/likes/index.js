const LikesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "likes",
  version: "1.0.0",
  register: async (server, { likesService }) => {
    const handler = new LikesHandler(likesService);
    server.route(routes(handler));
  },
};
