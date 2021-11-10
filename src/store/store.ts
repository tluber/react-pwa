import { applyMiddleware, CombinedState, combineReducers, createStore, Reducer } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import localStorage from "redux-persist/es/storage";
import { composeEnhancers } from "./enhancer/devToolsEnhancer";
import { serviceCallMiddleware } from "./middleware/serviceCallMiddleware";
import { environmentReducer } from "./reducer/environmentReducer";
import { pendingServiceCallReducer } from "./reducer/pendingServiceCallReducer";
import { secureReducer } from "./reducer/secureReducer";

declare module "react-redux" {
	interface DefaultRootState extends StoreContent {}
}

type StateOf<T> = T extends Reducer<CombinedState<infer C>, infer A> ? C : never;

const persistentReducer = persistReducer(
	{
		key: "root",
		keyPrefix: "",
		version: 1,
		storage: localStorage
	},
	combineReducers({
		environment: environmentReducer,
		secure: secureReducer
	})
);

const volatileReducer = combineReducers({
	pendingCalls: pendingServiceCallReducer
});

const storeReducer = combineReducers({
	volatile: volatileReducer,
	persistent: persistentReducer
});

const enhancers = composeEnhancers(applyMiddleware(serviceCallMiddleware));

export const store = createStore(storeReducer, undefined, enhancers);

export type StoreContent = StateOf<typeof storeReducer>;

export const persistor = persistStore(store);
