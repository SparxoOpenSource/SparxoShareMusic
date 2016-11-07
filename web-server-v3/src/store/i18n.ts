import $ = require("jquery");

import i18n from "../i18n/app";

export const LANGUAGE_CHANGE = "LANGUAGE_CHANGE";

export function languageChange(lang) {
    return {
        type: LANGUAGE_CHANGE,
        payload: lang
    }
}


export const updateLanguage = (lang_name = "en-US") => {
    return (dispatch, getState) => {
        require.ensure([], (require)=> {
            var x = require("../i18n/" + lang_name + "/app.json");
            dispatch(languageChange(x));
        }, "i18n.en-US");
    }
}

const initialState = i18n;

export default function languageReducer(state = initialState, action) {
    if (action.type === LANGUAGE_CHANGE) {
        return $.extend({}, state, action.payload);
    }
    return state;
}

