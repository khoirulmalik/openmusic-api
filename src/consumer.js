require("dotenv").config();
const amqp = require("amqplib");
const { Pool } = require("pg");
const nodemailer = require("nodemailer");

const pool = new Pool();

const PlaylistsService = {
  getPlaylistById: async (playlistId) => {
    const playlistQuery = {
      text: `SELECT id, name FROM playlists WHERE id = $1`,
      values: [playlistId],
    };
    const playlistResult = await pool.query(playlistQuery);

    if (!playlistResult.rows.length) {
      throw new Error("Playlist tidak ditemukan");
    }

    const playlist = playlistResult.rows[0];

    const songsQuery = {
      text: `SELECT s.id, s.title, s.performer
             FROM songs s
             JOIN playlist_songs ps ON ps.song_id = s.id
             WHERE ps.playlist_id = $1`,
      values: [playlistId],
    };
    const songsResult = await pool.query(songsQuery);

    return {
      id: playlist.id,
      name: playlist.name,
      songs: songsResult.rows,
    };
  },
};

const MailSender = {
  sendEmail: async (targetEmail, content) => {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const message = {
      from: process.env.SMTP_USER,
      to: targetEmail,
      subject: "Ekspor Playlist",
      text: "Terlampir hasil dari ekspor playlist",
      attachments: [
        {
          filename: "playlist.json",
          content,
        },
      ],
    };

    return transporter.sendMail(message);
  },
};

const init = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue("export:playlist", {
    durable: true,
  });

  channel.consume("export:playlist", async (message) => {
    try {
      const { playlistId, targetEmail } = JSON.parse(
        message.content.toString()
      );

      const playlist = await PlaylistsService.getPlaylistById(playlistId);
      const result = JSON.stringify({ playlist });

      await MailSender.sendEmail(targetEmail, result);

      console.log(`Email sent to ${targetEmail}`);
      channel.ack(message);
    } catch (error) {
      console.error("Error processing message:", error);
      channel.nack(message, false, false);
    }
  });

  console.log("Consumer running...");
};

init();
