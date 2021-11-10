import * as t from "io-ts";

export const ResponseContainerCodec = t.intersection([
	t.strict({
		success: t.boolean,
		status: t.number
	}),
	t.union([
		t.strict({
			error: t.type({
				code: t.number,
				message: t.string
			})
		}),
		t.strict({
			errors: t.array(t.string)
		}),
		t.strict({
			data: t.unknown
		})
	])
]);

export type ResponseContainer = t.OutputOf<typeof ResponseContainerCodec>;
