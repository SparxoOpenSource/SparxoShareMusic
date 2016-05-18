import {session} from "../constants/actionTypes"

const initialState = {
    token:null,
    user:{},
    errorMessage:null,
    hasError:false,
    isLoading:false
}


var handlers={
    [session.pending]:function(state) {
        return  Object.assign({},state,{
            isLoading:true,
            hasError:false
        });
    },
    [session.success]:function(state,action) {
      return Object.assign({},state,action.data,{
          hasError:false,
          isLoading:false
      });  
    },
    [session.error]:function(state,action) {
      return Object.assign({},state,{
          hasError:true,
          isLoading:false,
          errorMessage:action.errorMessage
      });  
    }
}
/**
 * 操作
 */
export default function sessionReducer(state = initialState, action = { type: "" }) {
    var func=handlers[action.type];    
    if(func){
        return func(state,action);
    }
    return  state;   
}