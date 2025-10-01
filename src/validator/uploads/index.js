const InvariantError = require("../../exceptions/InvariantError");

const UploadsValidator = {
  validateImageHeaders: (headers) => {
    const contentType = headers["content-type"];

    if (!contentType) {
      throw new InvariantError("Header content-type tidak ditemukan");
    }

    // Check if it's an image
    const validImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!validImageTypes.includes(contentType.toLowerCase())) {
      throw new InvariantError("Tipe file harus berupa gambar");
    }
  },
};

module.exports = UploadsValidator;
