// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require("react");
import {PlayerService, Music} from "../services/playerService";
export class Player extends React.Component<{isMainPlayer:boolean}, {}>{

    state = {
        name: "未播放音乐",
        img: "/images/music_beamed.png"
    }
    componentDidMount() {
        var self = this;
        var player = this.refs['player'];
        PlayerService.setPlayer(player);
        PlayerService.on("play.changed", (music: Music) => {
            self.setState({
                name: music.name,
                img: music.image
            })
        })
    }

    render() {
        return <div ref="player-bar" className="navbar navbar-player navbar-default navbar-fixed-bottom navbar-inverse">                
        <div className="container">
            <div className="media">
                <div className="media-left">
                    <a href="#">
                        <img style={{ width: '70px', height: '70px' }} class="media-object" src={this.state.img} alt={this.state.name}/>
                    </a>
                </div>
                <div className="media-body" style={{ position: 'relative' }}>
                    <h4 className="media-heading" style={{ marginTop: '10px', color: '#fff' }}>{this.state.name}</h4>
                    <audio ref="player" controls={this.props.isMainPlayer} style={{ width: '800px', bottom: '00px' }}></audio>
                </div>
            </div>
        </div>
        </div>
    }
}