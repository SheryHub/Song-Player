// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Fetch and display data when the page loads
    fetchArtists();
    fetchAlbums();
    fetchSongs();

    // User Registration Form Submission
    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const userData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };
        registerUser(userData);
    });

    // User Login Form Submission
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const userData = {
            username: document.getElementById('loginUsername').value,
            password: document.getElementById('loginPassword').value
        };
        loginUser(userData);
    });

    // Add Artist Form Submission
    document.getElementById('addArtistForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const artistData = {
            artist_name: document.getElementById('artistName').value,
            genre: document.getElementById('genre').value,
            debut_year: document.getElementById('debutYear').value
        };
        addArtist(artistData);
    });

    // Add Album Form Submission
    document.getElementById('addAlbumForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const albumData = {
            album_name: document.getElementById('albumName').value,
            release_date: document.getElementById('releaseDate').value,
            artist_id: document.getElementById('artistId').value
        };
        addAlbum(albumData);
    });

    // Add Song Form Submission
    document.getElementById('addSongForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const songData = {
            song_name: document.getElementById('songName').value,
            duration: document.getElementById('duration').value,
            mp3_file: document.getElementById('mp3File').files[0],
            album_id: document.getElementById('albumId').value,
            artist_id: document.getElementById('artistId').value
        };
        addSong(songData);
    });

    // Create Playlist Form Submission
    document.getElementById('createPlaylistForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const playlistData = {
            playlist_name: document.getElementById('playlistName').value,
            user_id: document.getElementById('userId').value
        };
        createPlaylist(playlistData);
    });

    // Subscribe Form Submission
    document.getElementById('subscribeForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const subscriptionData = {
            user_id: document.getElementById('userIdSub').value,
            plan_name: document.getElementById('planName').value
        };
        subscribeToPlan(subscriptionData);
    });
});

// Fetch all artists and update UI
function fetchArtists() {
    fetch('/artists')
        .then(response => response.json())
        .then(artists => {
            const artistList = document.getElementById('artistList');
            artistList.innerHTML = '';
            artists.forEach(artist => {
                const artistItem = document.createElement('div');
                artistItem.classList.add('item');
                artistItem.innerHTML = `
                    <strong>${artist.artist_name}</strong> - ${artist.genre} (${artist.debut_year})
                `;
                artistList.appendChild(artistItem);
            });
        })
        .catch(error => console.error('Error fetching artists:', error));
}

// Add a new artist
function addArtist(artistData) {
    fetch('/artists', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(artistData)
    })
    .then(response => {
        if (response.ok) {
            fetchArtists();
        } else {
            console.error('Failed to add artist:', response.statusText);
        }
    })
    .catch(error => console.error('Error adding artist:', error));
}

// Fetch all albums and update UI
function fetchAlbums() {
    fetch('/albums')
        .then(response => response.json())
        .then(albums => {
            const albumList = document.getElementById('albumList');
            albumList.innerHTML = '';
            albums.forEach(album => {
                const albumItem = document.createElement('div');
                albumItem.classList.add('item');
                albumItem.innerHTML = `
                    <strong>${album.album_name}</strong> - Released on ${album.release_date} (Artist ID: ${album.artist_id})
                `;
                albumList.appendChild(albumItem);
            });
        })
        .catch(error => console.error('Error fetching albums:', error));
}

// Add a new album
function addAlbum(albumData) {
    fetch('/albums', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(albumData)
    })
    .then(response => {
        if (response.ok) {
            fetchAlbums();
        } else {
            console.error('Failed to add album:', response.statusText);
        }
    })
    .catch(error => console.error('Error adding album:', error));
}

// Fetch all songs and update UI
function fetchSongs() {
    fetch('/songs')
        .then(response => response.json())
        .then(songs => {
            const songList = document.getElementById('songList');
            songList.innerHTML = '';
            songs.forEach(song => {
                const songItem = document.createElement('div');
                songItem.classList.add('item');
                songItem.innerHTML = `
                    <strong>${song.song_name}</strong> - ${song.duration} seconds (Album ID: ${song.album_id}, Artist ID: ${song.artist_id})
                `;
                songList.appendChild(songItem);
            });
        })
        .catch(error => console.error('Error fetching songs:', error));
}

// Add a new song
function addSong(songData) {
    const formData = new FormData();
    formData.append('song_name', songData.song_name);
    formData.append('duration', songData.duration);
    formData.append('mp3_file', songData.mp3_file);
    formData.append('album_id', songData.album_id);
    formData.append('artist_id', songData.artist_id);

    fetch('/songs', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            fetchSongs();
        } else {
            console.error('Failed to add song:', response.statusText);
        }
    })
    .catch(error => console.error('Error adding song:', error));
}

// Register a new user
function registerUser(userData) {
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.ok) {
            console.log('User registered successfully');
        } else {
            console.error('Failed to register user:', response.statusText);
        }
    })
    .catch(error => console.error('Error registering user:', error));
}

// Login a user
function loginUser(userData) {
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.ok) {
            console.log('User logged in successfully');
            // Handle login success (e.g., save JWT token, redirect to dashboard)
        } else {
            console.error('Failed to login user:', response.statusText);
        }
    })
    .catch(error => console.error('Error logging in user:', error));
}

// Create a new playlist
function createPlaylist(playlistData) {
    fetch('/playlists', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(playlistData)
    })
    .then(response => {
        if (response.ok) {
            console.log('Playlist created successfully');
        } else {
            console.error('Failed to create playlist:', response.statusText);
        }
    })
    .catch(error => console.error('Error creating playlist:', error));
}

// Subscribe to a plan
function subscribeToPlan(subscriptionData) {
    fetch('/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscriptionData)
    })
    .then(response => {
        if (response.ok) {
            console.log('Subscribed to plan successfully');
        } else {
            console.error('Failed to subscribe to plan:', response.statusText);
        }
    })
    .catch(error => console.error('Error subscribing to plan:', error));
}

// Cancel a subscription
function cancelSubscription(userData) {
    fetch('/unsubscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.ok) {
            console.log('Subscription cancelled successfully');
        } else {
            console.error('Failed to cancel subscription:', response.statusText);
        }
    })
    .catch(error => console.error('Error cancelling subscription:', error));
}