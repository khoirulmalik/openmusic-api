const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists",
    handler: handler.postPlaylistHandler,
    options: { auth: "jwt_strategy" },
  },
  {
    method: "GET",
    path: "/playlists",
    handler: handler.getPlaylistsHandler,
    options: { auth: "jwt_strategy" },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}",
    handler: handler.deletePlaylistByIdHandler,
    options: { auth: "jwt_strategy" },
  },
  {
    method: "POST",
    path: "/playlists/{id}/songs",
    handler: handler.postSongToPlaylistHandler,
    options: { auth: "jwt_strategy" },
  },
  {
    method: "GET",
    path: "/playlists/{id}/songs",
    handler: handler.getSongsFromPlaylistHandler,
    options: { auth: "jwt_strategy" },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}/songs",
    handler: handler.deleteSongFromPlaylistHandler,
    options: { auth: "jwt_strategy" },
  },
];

module.exports = routes;
