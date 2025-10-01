const Jwt = require("@hapi/jwt");
const AuthenticationError = require("../exceptions/AuthenticationError");

const jwtAuthScheme = () => {
  return {
    authenticate: (request, h) => {
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        throw new AuthenticationError("Missing authentication");
      }

      const token = authHeader.replace("Bearer ", "");

      try {
        const artifacts = Jwt.token.decode(token);
        Jwt.token.verify(artifacts, process.env.ACCESS_TOKEN_KEY);

        const { userId } = artifacts.decoded.payload;

        return h.authenticated({
          credentials: { userId },
        });
      } catch (err) {
        if (err.message.includes("expired") || err.message.includes("exp")) {
          throw new AuthenticationError("Token expired");
        }

        throw new AuthenticationError("Token tidak valid");
      }
    },
  };
};

module.exports = jwtAuthScheme;
