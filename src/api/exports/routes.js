const routes = (handler) => [
  {
    method: "POST",
    path: "/export/playlists/{playlistId}",
    handler: handler.postExportPlaylistHandler,
    options: {
      auth: "jwt_strategy",
    },
  },
];

module.exports = routes;
