import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { emptySplitArchiveApi } from "./services/api/services/archiveApi/emptySplitArchiveApi";
import { emptySplitFormulaireApi } from "./services/api/services/formulaireApi/emptySplitFormulaireApi";

const rootReducer = combineReducers({
  [emptySplitFormulaireApi.reducerPath]: emptySplitFormulaireApi.reducer,
  [emptySplitArchiveApi.reducerPath]: emptySplitArchiveApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    // adding the api middleware enables caching, invalidation, polling and other features of `rtk-query`
    getDefaultMiddleware().concat(emptySplitFormulaireApi.middleware).concat(emptySplitArchiveApi.middleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
