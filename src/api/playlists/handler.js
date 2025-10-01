const autoBind = require("auto-bind"); // npm i auto-bind

class PlaylistsHandler {
  constructor(playlistsService, validator) {
    this._service = playlistsService;
    this._validator = validator;
    autoBind(this);
  }

  /* ---------- Playlist ---------- */
  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { userId: owner } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({
      name: request.payload.name,
      owner,
    });

    return h
      .response({
        status: "success",
        data: { playlistId },
      })
      .code(201);
  }

  async getPlaylistsHandler(request) {
    const { userId: owner } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(owner);

    return {
      status: "success",
      data: { playlists },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { userId: owner } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, owner);
    await this._service.deletePlaylistById(id);

    return {
      status: "success",
      message: "Playlist berhasil dihapus",
    };
  }

  /* ---------- Lagu di Playlist ---------- */
  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { userId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, userId);
    await this._service.addSongToPlaylist(playlistId, songId);

    return h
      .response({
        status: "success",
        message: "Lagu berhasil ditambahkan ke playlist",
      })
      .code(201);
  }

  async getSongsFromPlaylistHandler(request) {
    const { id: playlistId } = request.params;
    const { userId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, userId);
    const playlist = await this._service.getSongsFromPlaylist(playlistId);

    return {
      status: "success",
      data: { playlist },
    };
  }

  async deleteSongFromPlaylistHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { userId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, userId);
    await this._service.deleteSongFromPlaylist(playlistId, songId);

    return {
      status: "success",
      message: "Lagu berhasil dihapus dari playlist",
    };
  }
}

module.exports = PlaylistsHandler;
