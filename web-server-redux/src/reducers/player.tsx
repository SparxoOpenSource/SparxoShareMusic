import {player} from "../constants/actionTypes"

const initialState = {
    text: "test",
    items:[]
}


var handlers={
    [player.play]:function(state) {
        return  Object.assign({},state,{text:'now:'+new Date().toString()});
    },
    [player.getList]:function(state,action) {
        return Object.assign({},state,action);
    }
}


/**
 * 操作
 */
export default function playerReducer(state = initialState, action = { type: "" }) {
        
    var func=handlers[action.type];    
    if(func){
        return func(state,action);
    }
    return  state;   
}