import { i18n } from "../constants/actionTypes";

import { app } from "../constants/config";

function onSet(lang) {
    return {
        lang: lang,
        type: i18n.set
    };
}

export function set(lang = "en-US") {
    return (dispatch, getState) => {
        var langObj = getState().i18n;

        var modules = [];
        
       
    }
}