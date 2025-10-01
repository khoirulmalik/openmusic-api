class LikesHandler {
  constructor(likesService) {
    this._likesService = likesService;

    this.postLikeHandler = this.postLikeHandler.bind(this);
    this.deleteLikeHandler = this.deleteLikeHandler.bind(this);
    this.getLikesHandler = this.getLikesHandler.bind(this);
  }

  async postLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { userId } = request.auth.credentials;

    await this._likesService.addLike(userId, albumId);

    const response = h.response({
      status: "success",
      message: "Berhasil menyukai album",
    });
    response.code(201);
    return response;
  }

  async deleteLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { userId } = request.auth.credentials;

    await this._likesService.deleteLike(userId, albumId);

    return {
      status: "success",
      message: "Berhasil batal menyukai album",
    };
  }

  async getLikesHandler(request, h) {
    const { id: albumId } = request.params;

    const { likes, source } = await this._likesService.getLikesCount(albumId);

    const response = h.response({
      status: "success",
      data: {
        likes,
      },
    });

    if (source === "cache") {
      response.header("X-Data-Source", "cache");
    }

    return response;
  }
}

module.exports = LikesHandler;
