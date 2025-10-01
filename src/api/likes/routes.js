const routes = (handler) => [
  {
    method: "POST",
    path: "/albums/{id}/likes",
    handler: handler.postLikeHandler,
    options: {
      auth: "jwt_strategy",
    },
  },
  {
    method: "DELETE",
    path: "/albums/{id}/likes",
    handler: handler.deleteLikeHandler,
    options: {
      auth: "jwt_strategy",
    },
  },
  {
    method: "GET",
    path: "/albums/{id}/likes",
    handler: handler.getLikesHandler,
  },
];

module.exports = routes;
