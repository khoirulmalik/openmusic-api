exports.up = (pgm) => {
  pgm.createTable("authentications", {
    token: { type: "text", primaryKey: true },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("authentications");
};
