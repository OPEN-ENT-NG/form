import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { emptySplitFormulaireApi } from "./services/api/formulaireApi/emptySplitFormulaireApi";
import { emptySplitFormulairePublicApi } from "./services/api/formulairePublicApi/emptySplitFormulairePublicApi";

const rootReducer = combineReducers({
  [emptySplitFormulairePublicApi.reducerPath]: emptySplitFormulairePublicApi.reducer,
  [emptySplitFormulaireApi.reducerPath]: emptySplitFormulaireApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    // adding the api middleware enables caching, invalidation, polling and other features of `rtk-query`
    getDefaultMiddleware().concat(emptySplitFormulairePublicApi.middleware).concat(emptySplitFormulaireApi.middleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
