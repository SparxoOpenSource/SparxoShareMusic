import {add} from "../constants/actionTypes"
import * as $ from "jquery";
const initialState = {
    url:'',
    visible: null,
    errorMessage: null,
    hasError: false,
    isLoading: false
}


var handlers = { 
    [add.pending]:function (state) {
        return $.extend({},state,{
            isLoading:true,
            hasError:false
        })
    },
    [add.success]:function(state) {
      return $.extend({},state,{
          visible:false,
          isLoading:false,
          url:""
      });  
    },
    [add.error]:function(state,action) {
        return $.extend({},state,{
          hasError:true,
          isLoading:false,
          errorMessage:action.errorMessage
      });  
    },
    [add.show]: function (state) {
        return $.extend({}, state, {
            visible: true      
        });
    },
    [add.hide]: function (state, action) {
        return $.extend({}, state, action.data, {
            visible: false,
            url:''
        });
    }
}
/**
 * 操作
 */
export default function addReducer(state = initialState, action = { type: "" }) {
    var func = handlers[action.type];
    if (func) {
        return func(state, action);
    }
    return state;
}