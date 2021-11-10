import {defaultEnvironments, Environment} from '../environment';

const defaultEnvironment: Environment = defaultEnvironments.dev;

export function environmentReducer(
    state: Environment | undefined = defaultEnvironment,
    action: EnvironmentAction
): Environment {
    switch (action.type) {
        case 'SET_ENVIRONMENT':
            return action.value;
        default:
            return state;
    }
}

export type EnvironmentAction = {
    type: 'SET_ENVIRONMENT';
    value: Environment;
};
