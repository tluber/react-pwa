import * as t from "io-ts";

export const printError = (errors: t.Errors): string => {
	const getContextPath = (context: t.Context): string => {
		return context
			.map((c, index) => (index === 0 ? c.type.name : `${c.key}:${c.type.name}`))
			.join("/");
	};
	return errors
		.map((e): string => {
			return e.message
				? e.message
				: "Invalid value " + JSON.stringify(e.value) + " supplied to " + getContextPath(e.context);
		})
		.join("\n\n");
};
