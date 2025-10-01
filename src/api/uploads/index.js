const UploadsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "uploads",
  version: "1.0.0",
  register: async (server, { storageService, albumsService, validator }) => {
    console.log("========= REGISTERING UPLOADS PLUGIN =========");

    const uploadsHandler = new UploadsHandler(
      storageService,
      albumsService,
      validator
    );

    const uploadRoutes = routes(uploadsHandler);
    console.log("Upload routes:", uploadRoutes);

    server.route(uploadRoutes);

    console.log("========= UPLOADS PLUGIN REGISTERED =========");
  },
};
