import { AuthenticationAction } from "./authenticationReducer";

export interface Authorization {
	token: string;
	refreshToken: string;
}

const defaultAuthorization: Authorization = {
	token: "",
	refreshToken: ""
};

export function secureReducer(
	state: Authorization | undefined = defaultAuthorization,
	action: AuthorizationAction | AuthenticationAction
): Authorization {
	switch (action.type) {
		case "LOGGED_IN":
			return action.authorization;
		case "SET_AUTHORIZATION":
			return action.value;
		case "CLEAR_AUTHORIZATION":
			return defaultAuthorization;
		default:
			return state;
	}
}

export type AuthorizationAction =
	| {
			type: "SET_AUTHORIZATION";
			value: Authorization;
	  }
	| {
			type: "CLEAR_AUTHORIZATION";
	  };
