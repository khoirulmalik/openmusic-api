/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("user_album_likes", {
    id: {
      type: "varchar(50)",
      primaryKey: true,
    },
    user_id: {
      type: "varchar(50)",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE",
    },
    album_id: {
      type: "varchar(50)",
      notNull: true,
      references: '"albums"',
      onDelete: "CASCADE",
    },
  });

  // Unique constraint untuk user + album
  pgm.addConstraint("user_album_likes", "unique_user_album_like", {
    unique: ["user_id", "album_id"],
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint("user_album_likes", "unique_user_album_like");
  pgm.dropTable("user_album_likes");
};
