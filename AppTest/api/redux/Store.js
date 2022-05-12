import { configureStore } from '@reduxjs/toolkit';

import playListTrackReducer from './PlaylistTrackReducer';

export const store = configureStore({
    reducer: {
        track: playListTrackReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
}); 