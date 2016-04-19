
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Player} from "./components/player";
import {PlayList} from "./components/list";
import {PlayerService} from "./services/playerService";

class MusicApp extends React.Component<{}, {}>{

    state = {
        isMainPlayer: PlayerService.isMainPlayer,
        keyword: ""
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
        PlayerService.studioAddMusic(url, () => {
            this.setState({
                keyword: ""
            });
        });
    }
    search() {
        var urlInput = this.refs["txt_url"] as HTMLInputElement;
        var url = urlInput.value;       
        this.setState({
            keyword: urlInput.value
        });
    }
    render() {
        return <div>
            <div className="container" style={{ marginBottom: '80px', marginTop: '20px' }}>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        Sparxo Player - [{localStorage['username']}]
                        <label className="pull-right" >
                            <input type="checkbox"checked={this.state.isMainPlayer} onChange={this.checkedChanged.bind(this) }  style={{ verticalAlign: 'top' }} />
                            主播放器
                        </label>
                    </div>
                    <div className="panel-body">
                        <div className="input-group">
                            <input type="text"  ref="txt_url" value={this.state.keyword} onChange={this.search.bind(this) } className="form-control"  placeholder="163音乐地址" />
                            <span className="input-group-btn">
                                <button className="btn btn-default" onClick={this.addMusic.bind(this) } disabled={this.state.keyword.indexOf("http://music.163.com")==-1}  type="button">添加</button>
                            </span>
                        </div>
                    </div>
                    <PlayList filter={this.state.keyword}></PlayList>
                </div>
            </div>
            <Player isMainPlayer={this.state.isMainPlayer}></Player>
        </div>
    }
}


class Login extends React.Component<{}, {}> {

    login(e) {
        e.nativeEvent.preventDefault();
        var txtInput = this.refs["userName"] as HTMLInputElement;
        if (txtInput.value == "") {
            alert("请输入用户名")
            return;
        }
        localStorage["username"] = txtInput.value;
        initApp(txtInput.value);
    }
    render() {
        return <div>
            <div className="container" style={{ marginBottom: '80px', marginTop: '20px' }}>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        Sparxo Player
                    </div>
                    <div className="panel-body">
                        <form onSubmit={this.login.bind(this) }>
                            <div className="form-group">
                                <label>用户名</label>
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

var username = localStorage['username'] || "";
if (username == '') {
    ReactDOM.render(<Login/>, document.getElementById("app"));
}
else {
    initApp(username);
}
function initApp(username) {

    PlayerService.init(username).then(() => {
        return PlayerService.studio();
    }).then(() => {
        return PlayerService.studioUserIsExisted(username);
    }).then(() => {
        PlayerService.studioEnter(username);
        ReactDOM.render(<MusicApp/>, document.getElementById("app"));

    }).catch(message => {
        localStorage.removeItem("username");
        ReactDOM.render(<Login/>, document.getElementById("app"));
        alert(message);
    });
}