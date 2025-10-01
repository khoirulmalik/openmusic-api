exports.up = (pgm) => {
  pgm.createTable("playlist_songs", {
    id: { type: "varchar(50)", primaryKey: true },
    playlist_id: { type: "varchar(50)", notNull: true },
    song_id: { type: "varchar(50)", notNull: true },
  });

  // UNIQUE(playlist_id, song_id)
  pgm.addConstraint(
    "playlist_songs",
    "unique_playlist_song",
    "UNIQUE(playlist_id, song_id)"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("playlist_songs");
};
