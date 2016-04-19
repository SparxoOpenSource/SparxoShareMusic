// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require("react");
import {PlayerService, Music} from "../services/playerService";

export class MusicItem extends React.Component<{ music: Music }, {}>{

    constructor(props?, context?) {
        super(props, context);

        var self = this;
        this.props.music.on("stateChange", (isPlay) => {
            self.setState({
                isPlay: isPlay
            })
        })
    }
    state = {
        isPlay: false
    }
    play() {
        PlayerService.studioPlayMusic(this.props.music.id);
    }
    removeMusic(){
        PlayerService.studioRemoveMusic(this.props.music.id);
    }
    render() {
        var music = this.props.music;
        return <li className={this.state.isPlay ? "list-group-item active" : "list-group-item"}>
            <div className="media">
                <div className="media-left">
                    <a href="#" onClick={this.play.bind(this) }>
                        <img style={{ width: '84px', height: '84px' }} class="media-object" src={music.image} alt={music.name} />
                    </a>
                </div>
                <div className="media-body" style={{ position: 'relative' }}>
                    <h4 className="media-heading">
                        {music.name} 
                        <div className="pull-right">{music.orderer}</div>
                    </h4>
                    <p>{music.artists}</p>
                    <div className="btn-group" role="group" aria-label="...">
                        <button type="button" className="btn btn-default btn-sm"  onClick={this.play.bind(this) }>播放</button>
                        <button type="button" className="btn btn-default btn-sm" onClick={this.removeMusic.bind(this)}>删除</button>
                    </div>
                </div>
            </div>
        </li>
    }
}
export class PlayList extends React.Component<{filter:string}, { musics: Music[] }> {

    constructor() {
        super();
        var self = this;
        PlayerService.on("list.changed").then((musics: Music[]) => {
            self.setState({
                musics: musics
            });
        });
        this.state = {
            musics: PlayerService.musics
        };
    }

    render() {
        return <ul className="list-group">
            {this.state.musics.map(music => {
                if(this.props.filter.indexOf("http://music.163.com")!=-1){
                     return <MusicItem key={music.id} music={music} />
                }
                if (music.name.toLocaleLowerCase().indexOf(this.props.filter.toLocaleLowerCase())!=-1||music.artists.toLocaleLowerCase().indexOf(this.props.filter.toLocaleLowerCase())) {
                     return <MusicItem key={music.id} music={music} />
                }
            }) }
        </ul>
    }
}