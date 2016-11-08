import * as React from 'react'
import Player from "./Player";

import "./Home.less";

class Home extends React.Component<any, any>{

    state = {
        filter: "",
        isAdd: false,
        isMainPlayer: JSON.parse(localStorage["isMainPlayer"] || "false")
    }

    componentWillMount() {

        this.props.initAsync();
    }
    addItem() {
        var inputUrl = this.refs["add_url"] as HTMLInputElement;
        var url = inputUrl.value;
        this.props.addAsync(url);
        this.setState({
            filter: "",
            isAdd: false
        })
    }
    playItem(id) {
        this.props.playAsync(id);
    }
    removeItem(id) {
        this.props.removeAsync(id);
    }
    onChange(e: any) {
        var v = e.target.value;
        if (v.indexOf("http") == 0) {
            this.setState({
                filter: v,
                isAdd: true
            });
            return;
        }

        this.setState({ filter: v, isAdd: false });
    }
    onCheck() {
        var _isMain = !this.state.isMainPlayer;
        localStorage["isMainPlayer"] = _isMain;
        this.setState({ isMainPlayer: _isMain });
    }
    render() {
        var {current, playlist} = this.props;
        var current_music = playlist.find(s => s.id == current);
        if (current_music) {
            setTimeout(() => {
                var $el=$('#'+current_music.id);
                if($el.length > 0){
                    var top = $el.position().top;
                    $(".play-list").animate({ "scrollTop": top }, 200);
                }
            }, 10);
        }
        else {
            current_music = {}
        }
        return <div className="main-container">
            <div className="background-image" style={{ backgroundImage: `url('${current_music.image}')` }}></div>
            <div className="search-bar">
                <div className="container">
                    <div className="input-group input-group-lg" style={{ width:'100%'}}>
                        <input ref="add_url" placeholder="search or url(163, sogou, soundcloud)" value={this.state.filter} onChange={(e) => this.onChange(e)} className="form-control" />
                        {
                            (() => {
                                if (this.state.isAdd) {
                                    return <span className="input-group-btn">
                                        <button style={{ padding:"10px 26px" }} className="btn btn-default" onClick={() => this.addItem()}>add</button>
                                    </span>
                                }
                            })()
                        }

                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col col-sm-5 hidden-xs">
                        <div className="play-info">
                            <div className="play-image">
                                <img src={current_music.image} />
                            </div>
                            <h2>{current_music.name}</h2>
                            <p>{(current_music.artists || []).join(' ')}</p>
                        </div>
                        <div className="play-control">
                            <div className="checkbox">
                                <label>
                                    <input type="checkbox" checked={this.state.isMainPlayer} onChange={() => this.onCheck()}/> Main Player
                                </label>
                             </div>
                        </div>
                    </div>
                    <div className="col col-sm-7">
                        <div className="play-list">
                            <ul>
                                {playlist.filter(item => {
                                    if (this.state.filter == "") {
                                        return true;
                                    }
                                    if (this.state.isAdd) {
                                        return true;
                                    }
                                    return item.name.indexOf(this.state.filter) > -1;
                                }).map((item) =>
                                    <li key={item.id} id={item.id} className={current == item.id ? 'playing' : ''}>
                                        <a className="song-times" href="javascript:;" onClick={() => this.removeItem(item.id)}>&times;</a>
                                        <a className="media" href="javascript:;" onClick={() => this.playItem(item.id)}>
                                            <div className="media-left">
                                                <img src={item.image} alt="..." />
                                            </div>
                                            <div className="media-body">
                                                <h4 className="media-heading">{item.name}</h4>
                                                <p>{(item.artists || []).join(' ')}</p>                                                
                                            </div>
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {
                (() => {
                    if (this.state.isMainPlayer) {
                        return <Player playSong={current_music} play={(id) => this.playItem(id)} playlist={playlist} />
                    }
                })()
            }            
        </div>
    }
}
export default Home
