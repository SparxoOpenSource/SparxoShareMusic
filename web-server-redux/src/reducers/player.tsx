import {player} from "../constants/actionTypes"

const initialState = {
    text: "test",
    items:[]
}


var handlers={
    [player.play]:function(state) {
        return  Object.assign({},state,{text:'now:'+new Date().toString()});
    },
    [player.getList]:function(state) {
        return Object.assign({},state,{items:[{a:1},{a:2},{a:new Date().toString()}]});
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