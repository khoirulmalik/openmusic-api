exports.up = (pgm) => {
  pgm.addColumn("albums", {
    cover_url: { type: "text" },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("albums", "cover_url");
};
