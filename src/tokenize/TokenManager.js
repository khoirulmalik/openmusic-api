const Jwt = require("@hapi/jwt");
const InvariantError = require("../exceptions/InvariantError");

const TokenManager = {
  generateAccessToken: (payload) =>
    Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY, {
      ttlSec: parseInt(process.env.ACCESS_TOKEN_AGE), // 1800 detik
    }),

  generateRefreshToken: (payload) =>
    Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),

  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verify(artifacts, process.env.REFRESH_TOKEN_KEY);
      return artifacts.decoded.payload;
    } catch (error) {
      throw new InvariantError("Refresh token tidak valid");
    }
  },

  decodeToken: (token) => {
    try {
      const artifacts = Jwt.token.decode(token);
      return artifacts.decoded.payload;
    } catch (error) {
      throw new InvariantError("Token tidak dapat didecode");
    }
  },
};

module.exports = TokenManager;
