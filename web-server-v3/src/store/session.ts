import $ = require("jquery");
import ws, { join } from "../api/socket";

export const USER_LOGIN = "USER_LOGIN";

export function login(user, room_id) {
    return join(user, room_id);    
}

export function set(user) {
    return {
        type: USER_LOGIN,
        payload: user
    };
}
const initialState = {
    user: null
};

export default function sessionReducer(state = initialState, action) {
    if (action.type === USER_LOGIN) {
        return $.extend({}, state, { user: action.payload });
    }
    return state;
}

