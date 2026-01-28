import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { emptySplitArchiveApi } from "./services/api/services/archiveApi/emptySplitArchiveApi";
import { emptySplitFormulaireApi } from "./services/api/services/formulaireApi/emptySplitFormulaireApi";

const rootReducer = combineReducers({
  [emptySplitFormulaireApi.reducerPath]: emptySplitFormulaireApi.reducer,
  [emptySplitArchiveApi.reducerPath]: emptySplitArchiveApi.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      // adding the api middleware enables caching, invalidation, polling and other features of `rtk-query`
      getDefaultMiddleware().concat(emptySplitFormulaireApi.middleware).concat(emptySplitArchiveApi.middleware),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
