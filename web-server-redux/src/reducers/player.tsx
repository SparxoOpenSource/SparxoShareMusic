import {player} from "../constants/actionTypes"

const initialState = {
    text: "test"
}


var handlers={
    [player.play]:function(state) {
        return  Object.assign({},state,{text:'now:'+new Date().toString()});
    }
}


/**
 * 操作
 */
export default function playerReducer(state = initialState, action = { type: "" }) {
        
    var func=handlers[action.type];    
    if(func){
        return func(state);
    }
    return  state;   
}