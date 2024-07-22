import { createSlice } from '@reduxjs/toolkit'; 

const fetchedNews = "https://newsapi.org/v2/top-headlines?";

//set the news in local storage
const loadBookmarks=()=>{
    try{
        const Bookmarks = localStorage.getItem('bookmarks');
        return Bookmarks ? JSON.parse(Bookmarks) :[] ; 
    }catch (err) {
        console.error('Could not load bookmarks from localStorage', err);
        return [];
    }
}
const saveBookmarks = (bookmarks) => {
    try {
        const serializedBookmarks = JSON.stringify(bookmarks);
        localStorage.setItem('bookmarks', serializedBookmarks);
    } catch (err) {
        console.error('Could not save bookmarks to localStorage', err);
    }
};

const initialState = {
    bookmark: loadBookmarks(),
    items: fetchedNews,
    totalQuantity: 0,
};

export const bookmarkSlice = createSlice({
    name: 'bookmark',
    initialState,
    reducers: {
        addToBookmark: (state, action) => {
            const { title } = action.payload;
            const existingIndex = state.bookmark.findIndex((item) => item.title === title);
            if (existingIndex === -1) {
                state.bookmark.push(action.payload);
                saveBookmarks(state.bookmark)
            }else{
                return {
                    ...state,
                    bookmark:[...state.bookmark]
                }

            }
        },
        removeFromBookmark:(state,action)=>{
            state.bookmark = state.bookmark.filter((item)=>item.title!==action.payload.title);
            saveBookmarks(state.bookmark) ; 

        },
    },
});

export const {
    addToBookmark,
    removeFromBookmark,
} = bookmarkSlice.actions;

export default bookmarkSlice.reducer;