export function pendingServiceCallReducer(state: Record<string, boolean> = {}, action: PendingServiceCallAction) {
    switch (action.type) {
        case 'SERVICE_CALL_START':
            return {...state, [action.serviceKey]: true};
        case 'SERVICE_CALL_END':
            const {[action.serviceKey]: removed, ...rest} = state;
            return rest;
        default:
            return state;
    }
}

export type PendingServiceCallAction =
    | {
          type: 'SERVICE_CALL_START';
          serviceKey: string;
      }
    | {
          type: 'SERVICE_CALL_END';
          serviceKey: string;
      };
