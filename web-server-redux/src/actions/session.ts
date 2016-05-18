import {session} from "../constants/actionTypes"
import * as $player from "../api/player";
import * as $studio from "../api/studio";


function Pending() {
  return {
    type: session.pending
  };
}

function Fail(msg?) {
  return {
    type: session.error,
    errorMessage: msg
  }
}
function Success(data) {
  return {
    type: session.success,
    data: data
  }
}
export function login() {
  return (dispatch, getState) => {
    const login = getState().form.login;
    const username = login.username.value;
    const studioId = login.studioId.value;    
    dispatch(Pending());
    $studio.once("error",(data)=>{
      debugger;
      dispatch(Fail(""))
    }) 
    $studio.connect(username).then(() => { 
      return $studio.studio();
    }).then(() => {
      console.log("检查用户名");
      return $studio.checkUserName(username);
    }).then(() => {
      console.log("进入房间")
      return $studio.enter(username, studioId);
    }).then(() => {
      console.log("enterSence")
      return $studio.enterSence();
    }).then(() => {      
      console.log("登录成功");
      
      dispatch(Success({
        token: `${username} (${studioId})`,
        user: {
          username: username
        }
      }));
    }).fail((msg?) => {
      dispatch(Fail(msg||"登录失败，请稍后再试"));
    });
  }
}