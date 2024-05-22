from flask import Flask, request, jsonify, send_from_directory
import mysql.connector
from flask_cors import CORS
import os

app = Flask('Song Player', static_folder='static')
CORS(app)


# Function to establish connection to the MySQL database
def connect_to_database():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="ProjectDB123",
            database="song_player"
        )
        return connection
    except mysql.connector.Error as error:
        print("Error connecting to MySQL database:", error)


# API endpoint to get all artists
@app.route('/artists', methods=['GET'])
def get_artists():
    connection = connect_to_database()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM artists")
    artists = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(artists)


# API endpoint to add a new artist
@app.route('/artists', methods=['POST'])
def add_artist():
    data = request.json
    artist_name = data['artist_name']
    genre = data['genre']
    debut_year = data['debut_year']
    connection = connect_to_database()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO artists (artist_name, genre, debut_year) VALUES (%s, %s, %s)", (artist_name, genre, debut_year))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Artist added successfully"})


# API endpoint to get all albums
@app.route('/albums', methods=['GET'])
def get_albums():
    connection = connect_to_database()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM albums")
    albums = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(albums)


# API endpoint to add a new album
@app.route('/albums', methods=['POST'])
def add_album():
    data = request.json
    album_name = data['album_name']
    release_date = data['release_date']
    artist_id = data['artist_id']
    connection = connect_to_database()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO albums (album_name, release_date, artist_id) VALUES (%s, %s, %s)", (album_name, release_date, artist_id))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Album added successfully"})


# API endpoint to get all songs
@app.route('/songs', methods=['GET'])
def get_songs():
    connection = connect_to_database()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM songs")
    songs = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(songs)


# API endpoint to add a new song
@app.route('/songs', methods=['POST'])
def add_song():
    data = request.form
    song_name = data['song_name']
    duration = data['duration']
    #mp3_file = request.files['mp3_file'].read()
    mp3_file = data['mp3_file']
    album_id = data['album_id']
    artist_id = data['artist_id']
    connection = connect_to_database()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO songs (song_name, duration, mp3_file, album_id, artist_id) VALUES (%s, %s, %s, %s, %s)", (song_name, duration, mp3_file, album_id, artist_id))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Song added successfully"})


# API endpoint for user registration
@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    username = data['username']
    email = data['email']
    password = data['password']
    connection = connect_to_database()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO users (username, email, password, join_date) VALUES (%s, %s, %s, CURDATE())", (username, email, password))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "User registered successfully"})


# API endpoint for user login
@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    username = data['username']
    password = data['password']
    connection = connect_to_database()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
    user = cursor.fetchone()
    cursor.close()
    connection.close()
    if user:
        return jsonify({"message": "User logged in successfully", "user": user})
    else:
        return jsonify({"message": "Invalid credentials"}), 401


# API endpoint to create a new playlist
@app.route('/playlists', methods=['POST'])
def create_playlist():
    data = request.json
    playlist_name = data['playlist_name']
    user_id = data['user_id']
    connection = connect_to_database()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO playlists (playlist_name, user_id, created_date) VALUES (%s, %s, CURDATE())", (playlist_name, user_id))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Playlist created successfully"})


# API endpoint to add a song to a playlist
@app.route('/playlists/<int:playlist_id>/songs', methods=['POST'])
def add_song_to_playlist(playlist_id):
    data = request.json
    song_id = data['song_id']
    song_order = data.get('song_order', None)
    connection = connect_to_database()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO playlist_songs (playlist_id, song_id, song_order) VALUES (%s, %s, %s)", (playlist_id, song_id, song_order))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Song added to playlist successfully"})


# API endpoint to subscribe to a plan
@app.route('/subscribe', methods=['POST'])
def subscribe_to_plan():
    data = request.json
    user_id = data['user_id']
    plan_name = data['plan_name']
    connection = connect_to_database()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO subscriptions (user_id, plan_name, start_date) VALUES (%s, %s, CURDATE())", (user_id, plan_name))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Subscribed to plan successfully"})


# API endpoint to cancel subscription
@app.route('/unsubscribe', methods=['POST'])
def cancel_subscription():
    data = request.json
    user_id = data['user_id']
    connection = connect_to_database()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM subscriptions WHERE user_id = %s", (user_id,))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Subscription cancelled successfully"})


# Serve the static HTML file
@app.route('/')
def serve_static_index():
    return send_from_directory(app.static_folder, 'index.html')


# Serve other static files (CSS, JS)
@app.route('/<path:path>')
def serve_static_file(path):
    return send_from_directory(app.static_folder, path)


# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)