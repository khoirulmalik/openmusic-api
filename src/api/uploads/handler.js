const InvariantError = require("../../exceptions/InvariantError");

class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    this.postUploadCoverHandler = this.postUploadCoverHandler.bind(this);
  }

  async postUploadCoverHandler(request, h) {
    console.log("=== HANDLER CALLED ===");
    console.log("Full payload:", request.payload);
    console.log("Payload keys:", Object.keys(request.payload || {}));
    console.log("Request headers:", request.headers);

    const { cover } = request.payload;
    const { id } = request.params;

    console.log("cover:", cover);
    console.log("cover type:", typeof cover);

    // Validate that cover exists
    if (!cover) {
      console.log("ERROR: Cover not found in payload!");
      console.log("Available fields:", Object.keys(request.payload || {}));
      throw new InvariantError("Cover tidak ditemukan dalam payload");
    }

    console.log("cover.hapi.headers:", cover.hapi.headers);

    // Validate image headers
    this._validator.validateImageHeaders(cover.hapi.headers);

    // Get the file size from headers and validate explicitly
    const fileSize = cover.hapi.headers["content-length"];
    if (fileSize && parseInt(fileSize) > 512000) {
      const error = new Error(
        "Payload content length greater than maximum allowed: 512000"
      );
      error.output = {
        statusCode: 413,
        payload: {
          statusCode: 413,
          error: "Request Entity Too Large",
          message:
            "Payload content length greater than maximum allowed: 512000",
        },
      };
      throw error;
    }

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

    await this._albumsService.addAlbumCover(id, coverUrl);

    const response = h.response({
      status: "success",
      message: "Sampul berhasil diunggah",
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
