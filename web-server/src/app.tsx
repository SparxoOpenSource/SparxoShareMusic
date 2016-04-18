
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Player} from "./components/player";
import {PlayList} from "./components/list";
import {PlayerService} from "./services/playerService";

class MusicApp extends React.Component<{}, {}>{
    static propTypes = {
        title: React.PropTypes.string
    }
    state = {
        isMainPlayer: PlayerService.isMainPlayer
    }
    checkedChanged(checked) {
        this.setState({
            isMainPlayer: !this.state.isMainPlayer
        }, () => {
            PlayerService.setIsMainPlayer(this.state.isMainPlayer);     
       });
    }

    addMusic() {
        var urlInput = this.refs["txt_url"] as HTMLInputElement;
        var url = urlInput.value;
        if (url.indexOf("http://music.163.com") == -1) {
            alert("只支持163音乐");
            return;
        }
        PlayerService.studioAddMusic(url,()=>{            
            urlInput.value = "";            
        });
    }
    render() {
        return <div>
            <div className="container" style={{ marginBottom: '80px' }}>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        Sparxo Player
                        <label className="pull-right" >
                            <input type="checkbox"checked={this.state.isMainPlayer} onChange={this.checkedChanged.bind(this) }  style={{ verticalAlign: 'top' }} />
                            主播放器
                        </label>
                    </div>
                    <div className="panel-body">
                        <div className="input-group">
                            <input type="text"  ref="txt_url"  className="form-control"  placeholder="163音乐地址" />
                            <span className="input-group-btn">
                                <button className="btn btn-default" onClick={this.addMusic.bind(this) }  type="button">添加</button>
                            </span>
                        </div>
                    </div>
                    <PlayList></PlayList>
                </div>
            </div>
            <Player isMainPlayer={this.state.isMainPlayer}></Player>          
        </div>
    }
}


class  Login extends React.Component<{},{}> {
    
    login(){
        var txtInput=this.refs["userName"] as HTMLInputElement;
        if(txtInput.value==""){
            alert("请输入用户名")
            return;
        }
        localStorage["username"]=txtInput.value;
        ReactDOM.render(<MusicApp />, document.getElementById("app"));
    }
    render(){        
        return <div>
            <div className="container" style={{ marginBottom: '80px' }}>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        Sparxo Player
                    </div>
                    <div className="panel-body">
                        <form action="#" onSubmit={this.login.bind(this)}>
                            <div className="form-group">
                                <label for="exampleInputEmail1">用户名</label>
                                <input type="text" ref="userName" className="form-control" placeholder="用户名"/>
                            </div>
                            <button type="submit" className="btn btn-default">登录</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    }
}

var username=localStorage['username']||"";
if(username==''){    
    ReactDOM.render(<Login/>,document.getElementById("app"));
}
else{
    initMusic();
}

function  initMusic() {
    PlayerService.init(username).then(()=>{        
       return PlayerService.studioUserIsExisted(username);          
    })
    .then(data=>{
        ReactDOM.render(<MusicApp/>,document.getElementById("app"));
    })
    .catch(message=>{        
        alert(message);
    });
}