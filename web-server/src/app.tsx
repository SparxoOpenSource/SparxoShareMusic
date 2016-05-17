
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Player} from "./components/player";
import {PlayList} from "./components/list";
import {PlayerService} from "./services/playerService";
import * as notification from "./services/notification";
import * as $  from 'jquery';



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
        if (url.indexOf("http://music.163.com") != -1) {
            PlayerService.studioAddMusic(url, () => {
                this.setState({
                    keyword: ""
                });
            });
        }
        if (url.indexOf("http://mp3.sogou.com/tiny/song") != -1) {
            var queryParams = PlayerService.parseQueryString(url);
            if (queryParams.tid) {
                return $.ajax({
                    url: "http://mp3.sogou.com/tiny/song?json=1&query=getlyric&tid=" + queryParams.tid,
                    dataType: 'jsonp',
                    jsonpCallback: "MusicJsonCallback"
                }).done((json) => {
                    var album_str = json.album_id + "";
                    PlayerService.importMusic([{
                        id: 'sogou-' + json.song_id,
                        name: json.song_name,
                        artists: [json.singer_name],
                        album: json.album_name,
                        image: "http://imgcache.qq.com/music/photo/album_300/" + parseInt(album_str.substr(album_str.length - 2)) + "/300_albumpic_" + json.album_id + "_0.jpg",
                        resourceUrl: json.play_url,
                        orderer: username || ""
                    }]).then(() => {
                        this.setState({
                            keyword: ""
                        });
                    });
                });

            }
        }
    }
    search() {
        var urlInput = this.refs["txt_url"] as HTMLInputElement;
        var url = urlInput.value;
        this.setState({
            keyword: urlInput.value
        });
    }
    export() {
        var musics = PlayerService.musics.map(m => {
            return m._raw_;
        });
        var a = document.createElement('a');
        a.setAttribute("download", "playlist.txt");
        a.href = "data:application/octet-stream," + JSON.stringify(musics);
        a.target = "_blank";
        a.click();
        setTimeout(function () {
            a.remove();
        }, 1000);
    }
    import() {
        var self = this;
        var s = document.createElement("input");
        s.type = "file";
        s.onchange = function (e) {
            self.onImport(s.files.item(0));
        }
        s.click();
        setTimeout(function () {
            s.remove();
        }, 1000);
    }
    onImport(file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var str = e.target['result'];
            var musics = JSON.parse(str);
            PlayerService.importMusic(musics);
        }
        reader.readAsText(file);
    }
    render() {
        return <div>
            <div className="container" style={{ marginBottom: '80px', marginTop: '20px' }}>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        Sparxo Player -[{localStorage['username']}]
                        <label className="pull-right" >
                            <input type="checkbox"checked={this.state.isMainPlayer} onChange={this.checkedChanged.bind(this) }  style={{ verticalAlign: 'top' }} />
                            主播放器
                        </label>
                        <a href="javascript:;" className="pull-right" style={{ paddingRight: "15px" }} onClick={this.import.bind(this) }>
                            导入
                        </a>
                        <a href="javascript:;" className="pull-right" style={{ paddingRight: "15px" }} onClick={this.export.bind(this) }>
                            导出
                        </a>
                    </div>
                    <div className="panel-body">
                        <div className="input-group">
                            <input type="text"  ref="txt_url" value={this.state.keyword} onChange={this.search.bind(this) } className="form-control"  placeholder="163音乐地址" />
                            <span className="input-group-btn">
                                <button className="btn btn-default" onClick={this.addMusic.bind(this) } disabled={this.state.keyword.indexOf("http://mp3.sogou.com/tiny/song") == -1 && this.state.keyword.indexOf("http://music.163.com") == -1}  type="button">添加</button>
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
        var txtStudioIdSelect = this.refs["studioId"] as HTMLSelectElement;
        if (txtInput.value == "") {
            alert("请输入用户名")
            return;
        }
        localStorage["username"] = txtInput.value;
        localStorage["studioId"] = txtStudioIdSelect.value;
        initApp(txtInput.value, txtStudioIdSelect.value);
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
                            <div className="form-group">
                                <label>房间</label>
                                <select className="form-control" ref="studioId">
                                    <option value="1">
                                        Sparxo Drug Manufacturing Laboratories
                                    </option>
                                    <option value="2">
                                        Sparxo Lovely Cottage
                                    </option>
                                </select>
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
var studioId = localStorage['studioId'] || "";
if (username == '' || studioId == '') {
    ReactDOM.render(<Login/>, document.getElementById("app"));
}
else {
    initApp(username, studioId);
}




function initApp(username, studioId) {

    PlayerService.init(username).then(() => {
        return PlayerService.studio();
    }).then(() => {
        return PlayerService.studioUserIsExisted(username);
    }).then(() => {
        notification.checkPermission();

        PlayerService.studioEnter(username, studioId);
        ReactDOM.render(<MusicApp/>, document.getElementById("app"));
    }).catch(message => {
        localStorage.removeItem("username");
        ReactDOM.render(<Login/>, document.getElementById("app"));
        alert(message);
    });
}