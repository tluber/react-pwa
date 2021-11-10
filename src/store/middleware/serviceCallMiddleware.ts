import { Action, AnyAction, Dispatch, MiddlewareAPI } from "redux";
import * as t from "io-ts";
import { StoreContent } from "../store";
import { Either, isRight, left, right } from "fp-ts/lib/Either";
import { printError } from "../../services/types/util/printError";

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
export type JSONValue = string | number | boolean | null | undefined | JSONObject | [JSONValue];
export type JSONObject = { [key: string]: JSONValue };

export type ServiceCallActionParams = Record<string, string | number | null>;
export enum ServerErrorCode {
	INTERNAL_SERVER_ERROR = 500,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403
}
export interface ServiceCallAction<T> extends Action {
	method: HTTPMethod;
	endpoint: string;

	body?: JSONObject;
	param?: ServiceCallActionParams;

	serviceKey: string;
	onStart?: () => Action;
	responseDecoder: t.Decoder<any, T>;
	onSuccess?: (result: T) => Action;
	onFailure?: (error: ServiceCallError) => Action;
}

export type ServiceCallError =
	| { type: "FETCH_ERROR"; error: any }
	| { type: "PARSE_ERROR"; error: string }
	| { type: "SERVER_ERROR"; errorCode: number; errorMessage: string };

async function performServiceCall<E, T>(
	apiHost: string,
	authToken: string,
	action: ServiceCallAction<T>
): Promise<Either<ServiceCallError, { parsed: T }>> {
	try {
		const requestHeaders = new Headers();
		requestHeaders.set("Content-Type", "application/json");
		if (authToken && !action.endpoint.startsWith("http")) {
			requestHeaders.set("Authorization", authToken);
		}

		let request: RequestInit = {
			headers: requestHeaders,
			method: action.method,
			body: action.body ? JSON.stringify(action.body) : undefined
		};

		const params = Object.entries(action.param || {})
			.map(([name, value]) => `${name}=${value}`)
			.join("&");

		const base = action.endpoint.startsWith("http")
			? `${action.endpoint}`
			: `${apiHost}/${action.endpoint}`;
		const uri = params ? `${base}?${params}` : `${base}`;

		const rawResponse = await fetch(uri, request);
		const rawData = await rawResponse.json();

		const response = action.responseDecoder.decode(rawData);

		if (!isRight(response)) {
			return left({
				type: "PARSE_ERROR",
				error: printError(response.left)
			});
		}

		if (Object.values(ServerErrorCode).includes(rawResponse.status)) {
			return left({
				type: "SERVER_ERROR",
				errorCode: rawResponse.status,
				errorMessage: rawData.error
			});
		}

		return right({ parsed: response.right });
	} catch (error) {
		return left({
			type: "FETCH_ERROR",
			error
		});
	}
}

export const serviceCallMiddleware =
	(store: MiddlewareAPI<Dispatch, StoreContent>) =>
	(next: Dispatch<AnyAction>) =>
	async <T>(action: ServiceCallAction<T>) => {
		if (action.type !== "SERVICE_CALL") {
			return next(action as any);
		}

		if (action.onStart) {
			store.dispatch(action.onStart());
		}
		store.dispatch({
			type: "SERVICE_CALL_START",
			serviceKey: action.serviceKey
		});

		const apiHost = store.getState().persistent.environment.apiHost;
		const sessionToken = store.getState().persistent.secure.token;

		const result = await performServiceCall(apiHost, sessionToken, action);

		store.dispatch({
			type: "SERVICE_CALL_END",
			serviceKey: action.serviceKey
		});

		if (isRight(result)) {
			if (action.onSuccess) {
				store.dispatch(action.onSuccess(result.right.parsed));
			}
			return right(result.right.parsed);
		} else {
			if (process.env.NODE_ENV !== "production") {
				console.log(result.left);
			}
			if (action.onFailure) {
				store.dispatch(action.onFailure(result.left));
			}
			return result;
		}
	};

// Overload to add type info to dispatch calls
declare module "redux" {
	export interface Dispatch<A extends Action> {
		<T>(action: ServiceCallAction<T>): Promise<Either<ServiceCallError, T>>;
	}
}
