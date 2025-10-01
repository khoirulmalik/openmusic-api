exports.up = (pgm) => {
  pgm.createTable("playlists", {
    id: { type: "varchar(50)", primaryKey: true },
    name: { type: "varchar(255)", notNull: true },
    owner: { type: "varchar(50)", notNull: true },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("playlists");
};
