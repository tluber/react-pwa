export interface Environment {
	apiHost: string;
}

export enum DefaultEnvironment {
	qa = "qa",
	prod = "prod",
	dev = "dev",
	local = "local"
}

export const defaultEnvironmentValues = [
	DefaultEnvironment.prod,
	DefaultEnvironment.qa,
	DefaultEnvironment.dev,
	DefaultEnvironment.local
];

export const defaultEnvironments: Record<DefaultEnvironment, Environment> = {
	[DefaultEnvironment.prod]: {
		apiHost: "http://13.58.68.49/server/"
	},
	[DefaultEnvironment.qa]: {
		apiHost: "http://13.58.68.49/server/"
	},
	[DefaultEnvironment.dev]: {
		apiHost: "https://reqres.in/"
	},
	[DefaultEnvironment.local]: {
		apiHost: "http://localhost:3000"
	}
};
