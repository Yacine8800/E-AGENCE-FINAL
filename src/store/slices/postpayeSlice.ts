import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PostpayeState {
  postpayes: PostpayeItem[];
  isLoading: boolean;
  error: string | null;
}

export interface PostpayeItem {
  id: string;
  identifiant: string;
  label: string;
  dateAjout: string;
  isAlert?: boolean;
}

const initialState: PostpayeState = {
  postpayes: [],
  isLoading: false,
  error: null,
};

const postpayeSlice = createSlice({
  name: "postpaye",
  initialState,
  reducers: {
    setPostpayes: (state, action: PayloadAction<PostpayeItem[]>) => {
      state.postpayes = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addPostpaye: (state, action: PayloadAction<PostpayeItem>) => {
      state.postpayes.push(action.payload);
      state.isLoading = false;
      state.error = null;
    },
    removePostpaye: (state, action: PayloadAction<string>) => {
      state.postpayes = state.postpayes.filter(
        (postpaye) => postpaye.id !== action.payload
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { 
  setPostpayes, 
  addPostpaye, 
  removePostpaye, 
  setLoading, 
  setError 
} = postpayeSlice.actions;

export default postpayeSlice.reducer;
