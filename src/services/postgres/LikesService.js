const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class LikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addLike(userId, albumId) {
    // Check if album exists
    await this._verifyAlbumExists(albumId);

    // Check if user already liked this album
    const checkQuery = {
      text: "SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    };

    const checkResult = await this._pool.query(checkQuery);

    if (checkResult.rows.length > 0) {
      throw new InvariantError("Anda sudah menyukai album ini");
    }

    const id = `like-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id",
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Gagal menyukai album");
    }

    // Delete cache
    await this._cacheService.delete(`likes:${albumId}`);

    return result.rows[0].id;
  }

  async deleteLike(userId, albumId) {
    const query = {
      text: "DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id",
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError(
        "Gagal batal menyukai album. Anda belum menyukai album ini"
      );
    }

    // Delete cache
    await this._cacheService.delete(`likes:${albumId}`);
  }

  async getLikesCount(albumId) {
    try {
      // Try get from cache
      const result = await this._cacheService.get(`likes:${albumId}`);
      return {
        likes: parseInt(result),
        source: "cache",
      };
    } catch (error) {
      // If not in cache, get from database
      const query = {
        text: "SELECT COUNT(*)::int as count FROM user_album_likes WHERE album_id = $1",
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const likes = result.rows[0].count;

      // Set cache for 30 minutes (1800 seconds)
      await this._cacheService.set(`likes:${albumId}`, likes, 1800);

      return {
        likes,
        source: "database",
      };
    }
  }

  async _verifyAlbumExists(albumId) {
    const query = {
      text: "SELECT id FROM albums WHERE id = $1",
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }
  }
}

module.exports = LikesService;
