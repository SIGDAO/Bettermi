import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { walletSlice } from "./wallet";
import { accountSlice } from "./account";
import { profileSlice } from "./profile";
import { userBMIApi } from "./userBMIApi";
import { userBMISlice } from "./userBMI";
import { loadState } from "./sessionStorage";
import { userRankingSlice } from "./userRanking";
import { selectedNftSlice } from "./selectedNft";
import { tokenAPI } from "./tokenAPI";
import { contractSlice } from "./contract";

const appReducer = combineReducers({
  wallet: walletSlice.reducer,
  account: accountSlice.reducer,
  profile: profileSlice.reducer,
  userBMI: userBMISlice.reducer,
  userRanking: userRankingSlice.reducer,
  selectedNft: selectedNftSlice.reducer,
  contract: contractSlice.reducer,
  [userBMIApi.reducerPath]: userBMIApi.reducer,
  [tokenAPI.reducerPath]: tokenAPI.reducer,
});
const rootReducer = (state:any, action:any) => {
  if (action.type === 'USER_LOGOUT') {
    localStorage.removeItem('persist:root')
    return appReducer(undefined, action)
  }
  return appReducer(state, action)
}
export const store = configureStore({
  preloadedState:loadState(),
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userBMIApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;