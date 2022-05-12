import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { playlistTrackEndpoint } from '../SpotifyEndpoints';
import { getData } from '../storage/TokenStorage';
import playlists from '../../data/PlaylistIDs';
import axiosInstance from '../AxiosInterceptor';

const initialState = {
    isLoading: false,
    data: [],
    isError: false
}

const playlistTrackSlice = createSlice({
    name: 'playlistTrack',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchPlaylistTrack.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchPlaylistTrack.fulfilled, (state, { payload }) => {
            state.data = payload;
            state.isLoading = false;
        });
        builder.addCase(fetchPlaylistTrack.rejected, (state) => {
            state.isLoading = false;
            state.error = true;
        });
    }
});

export const fetchPlaylistTrack = createAsyncThunk('playlist/track', async () => {
    // add moods here
    const mood = await getData('@mood');
    let playlistID = '';

    playlists.map((data) => {
        if (data.mood === mood) {
            playlistID = data.id;
        }
    })
    
    const url = playlistTrackEndpoint.getPlaylistTrack(playlistID);

    try {
        const response = await axiosInstance.get(url);

        return response.data;
    }
    catch (error) {
        return error;
    }
});

export const playlistTrackSelector = (state) => state.track;

export default playlistTrackSlice.reducer;