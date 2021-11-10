import { User } from "../../model/User";
import { Authorization } from "./secureReducer";

export function currentUserReducer(
	state: User | null | undefined = null,
	action: AuthenticationAction | UserAction
): User | null {
	switch (action.type) {
		case "LOGGED_IN":
			return action.user;
		case "LOGGED_OUT":
			return null;
		case "UPDATED_USER":
			if (action.user.id === state?.id) {
				return action.user;
			} else {
				return state;
			}
		default:
			return state;
	}
}

export type UserAction = {
	type: "UPDATED_USER";
	user: User;
};

export type AuthenticationAction =
	| {
			type: "LOGGED_IN";
			user: User;
			authorization: Authorization;
	  }
	| {
			type: "LOGGED_OUT";
	  };
