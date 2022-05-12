export const baseURL = 'https://api.spotify.com/v1';

export const playlistTrackEndpoint = {
    getPlaylistTrack: (playlistID) => {
        return `/playlists/${playlistID}/tracks`;
    }
}