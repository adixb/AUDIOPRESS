import {configureStore} from '@reduxjs/toolkit' ; 
import BookmarkReducer from '../Features/Bookmark' ; 

export const store = configureStore({
    reducer:{
        allBookmark:BookmarkReducer,
    }
})