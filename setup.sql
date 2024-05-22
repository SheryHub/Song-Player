CREATE DATABASE song_player;
USE song_player;

CREATE TABLE artists (
  artist_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  artist_name VARCHAR(100) NOT NULL,
  genre VARCHAR(50) NOT NULL,
  debut_year INT NOT NULL
);

CREATE TABLE albums (
  album_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  album_name VARCHAR(200) NOT NULL,
  release_date DATE NOT NULL,
  artist_id INT,
  FOREIGN KEY (artist_id) REFERENCES artists(artist_id)
);

CREATE TABLE songs (
  song_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  song_name VARCHAR(200) NOT NULL,
  duration INT NOT NULL,
  mp3_file VARCHAR(255),
  album_id INT,
  artist_id INT,
  FOREIGN KEY (album_id) REFERENCES albums(album_id),
  FOREIGN KEY (artist_id) REFERENCES artists(artist_id)
);

CREATE TABLE users (
  user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  join_date DATE NOT NULL
);

CREATE TABLE playlists (
  playlist_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  playlist_name VARCHAR(200) NOT NULL,
  user_id INT,
  created_date DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE subscriptions (
  subscription_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  plan_name VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE playlist_songs (
  playlist_id INT NOT NULL,
  song_id INT NOT NULL,
  song_order INT,
  FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id),
  FOREIGN KEY (song_id) REFERENCES songs(song_id),
  PRIMARY KEY (playlist_id, song_id)
);