exports.up = (pgm) => {
  // playlists.owner → users.id
  pgm.addConstraint("playlists", "fk_playlists_owner", {
    foreignKeys: {
      columns: "owner",
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });

  // playlist_songs.playlist_id → playlists.id
  pgm.addConstraint("playlist_songs", "fk_playlist_songs_playlist", {
    foreignKeys: {
      columns: "playlist_id",
      references: "playlists(id)",
      onDelete: "CASCADE",
    },
  });

  // playlist_songs.song_id → songs.id
  pgm.addConstraint("playlist_songs", "fk_playlist_songs_song", {
    foreignKeys: {
      columns: "song_id",
      references: "songs(id)",
      onDelete: "CASCADE",
    },
  });

  // songs.album_id → albums.id (cek IF NOT EXISTS via raw SQL)
  pgm.sql(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_songs_album'
      ) THEN
        ALTER TABLE songs
        ADD CONSTRAINT fk_songs_album
        FOREIGN KEY (album_id)
        REFERENCES albums(id)
        ON DELETE SET NULL;
      END IF;
    END $$;
  `);
};

exports.down = (pgm) => {
  pgm.dropConstraint("playlists", "fk_playlists_owner");
  pgm.dropConstraint("playlist_songs", "fk_playlist_songs_playlist");
  pgm.dropConstraint("playlist_songs", "fk_playlist_songs_song");
  pgm.dropConstraint("songs", "fk_songs_album");
};
