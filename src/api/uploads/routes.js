const routes = (handler) => [
  {
    method: "POST",
    path: "/albums/{id}/covers",
    handler: handler.postUploadCoverHandler,
    options: {
      payload: {
        maxBytes: 512000,
        output: "stream",
        parse: true,
        multipart: {
          output: "stream",
        },
      },
    },
  },
];

module.exports = routes;
