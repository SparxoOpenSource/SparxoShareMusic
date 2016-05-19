import * as React from 'react';
import {connect} from 'react-redux';
import {play} from '../../actions/player';

function mapStateToProps(state) {
    return state.player;
}
function mapDispatchToProps(dispatch) {
    return {
        play: (id) => dispatch(play(id))
    };
}
interface IPlayerProps extends React.Props<any> {
    mainPlayer: boolean;
    playSong: any;
    playlist: Array<any>;
    play: (id) => void;
};

function padZero(num, size) {
    let s = String(num);
    while (s.length < size) {
        s = `0${s}`;
    }
    return s;
}

function offsetLeft(element) {
    let el = element;
    let x = el.offsetLeft;

    while (el.offsetParent) {
        x += el.offsetParent.offsetLeft;
        el = el.offsetParent;
    }
    return x;
}
function formatSeconds(num) {
    const minutes = padZero(Math.floor(num / 60), 2);
    const seconds = padZero(num % 60, 2);
    return `${minutes}:${seconds}`;
}
class Player extends React.Component<IPlayerProps, {}> {

    state = {
        isPlaying: false,
        duration: 0,
        currentTime: 0,
        volume: 1
    }
    constructor(props, state) {
        super(props, state);        
        this.handleError = this.handleError.bind(this);
        this.handleEnded = this.handleEnded.bind(this);
        this.handleLoadedMetadata = this.handleLoadedMetadata.bind(this);
        this.handleLoadStart = this.handleLoadStart.bind(this);
        this.handlePause = this.handlePause.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
        this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
    }
    componentDidMount() {
        var audioEl = this.refs["player"] as HTMLAudioElement;
        audioEl.addEventListener("ended", this.handleEnded, false);
        audioEl.addEventListener('loadedmetadata', this.handleLoadedMetadata, false);
        audioEl.addEventListener('loadstart', this.handleLoadStart, false);
        audioEl.addEventListener("pause", this.handlePause, false);
        audioEl.addEventListener("play", this.handlePlay, false);
        audioEl.addEventListener("timeupdate", this.handleTimeUpdate, false);
        audioEl.addEventListener("volumechange", this.handleVolumeChange, false);
        audioEl.addEventListener("error",this.handleError,false);
    }
    componentWillUnmount() {
        var audioEl = this.refs["player"] as HTMLAudioElement;
        audioEl.removeEventListener('ended', this.handleEnded, false);
        audioEl.removeEventListener('loadedmetadata', this.handleLoadedMetadata, false);
        audioEl.removeEventListener('loadstart', this.handleLoadStart, false);
        audioEl.removeEventListener('pause', this.handlePause, false);
        audioEl.removeEventListener('play', this.handlePlay, false);
        audioEl.removeEventListener('timeupdate', this.handleTimeUpdate, false);
        audioEl.removeEventListener('volumechange', this.handleVolumeChange, false);  
        audioEl.removeEventListener("error",this.handleError,false);
    }
    handleError(){
        var self=this;
        setTimeout(function() {
            self.playNext();
        }, 1000);
    }
    handleEnded() {
        this.playNext();
    }
    handleLoadedMetadata() {
        const audioElement = this.refs["player"] as HTMLAudioElement;
        this.setState({
            duration: Math.floor(audioElement.duration),
        });
        audioElement.play();
    }
    handleLoadStart() {
        this.setState({
            duration: 0
        });
    }
    handlePause() {
        this.setState({
            isPlaying: false
        })
    }
    handlePlay() {
        this.setState({
            isPlaying: true
        })
    }
    handleTimeUpdate(e) {
        var audioEl = this.refs["player"] as HTMLAudioElement;
        this.setState({
            currentTime: Math.floor(audioEl.currentTime)
        })
    }
    handleVolumeChange(e) {
        const audioEl = this.refs["player"] as HTMLAudioElement;
        this.setState({
            volume: audioEl.volume
        })
    }
    playPrev() {
        var {playSong, playlist, play} = this.props;
        var index = playlist.findIndex(s => s.id == playSong.id);
        var next;
        if (index > 0) {
            next = playlist[index - 1];
        }
        else {
            next = playlist[playlist.length - 1];
        }
        play(next.id);

    }
    playNext() {
        var {playSong, playlist, play} = this.props;
        var index = playlist.findIndex(s => s.id == playSong.id);
        var next;
        if (index < playlist.length - 1) {
            next = playlist[index + 1];
        }
        else {
            next = playlist[0];
        }
        play(next.id);
    }
    tooglePlay() {
        var audioEl = this.refs["player"] as HTMLAudioElement;
        audioEl.paused ? audioEl.play() : audioEl.pause();
    }
    seek(e) {
        const audioEl = this.refs["player"] as HTMLAudioElement;
        const percent = (e.clientX - offsetLeft(e.currentTarget)) / e.currentTarget.offsetWidth;
        const currentTime = Math.floor(percent * this.state.duration);
        audioEl.currentTime = currentTime;
    }
    changeVolume(e) {
        const audioEl = this.refs["player"] as HTMLAudioElement;
        const volume = (e.clientX - offsetLeft(e.currentTarget)) / e.currentTarget.offsetWidth;
        audioEl.volume = volume;
    }
    render() {
        var {playSong, mainPlayer} = this.props;
        var resourceUrl = playSong ? playSong.resourceUrl : '';
        var image = playSong ? playSong.image : "";
        var musicName = playSong ? playSong.name : "";
        var orderer = playSong ? playSong.orderer : "";
        return <div className="player fixed bottom-0 left-0 right-0">
            <audio id="player" ref="player" src={resourceUrl}></audio>
            <div className="player-main">
                <div className="player-section player-info">
                    <img className="player-image" src={image}/>
                    <div className="song-card-details">
                        <a className="song-card-title">
                            {musicName}
                        </a>
                        <a className="song-card-user-username">{orderer}</a>
                    </div>
                </div>
                <div className="player-section">
                    <div className="player-button" onClick={this.playPrev.bind(this)}>
                        <i className="icon ion-ios-rewind"></i>
                    </div>
                    <div className="player-button" onClick={this.tooglePlay.bind(this) }>
                        <i className={this.state.isPlaying ? 'icon ion-ios-pause' : 'icon ion-ios-play'}></i>
                    </div>
                    <div className="player-button" onClick={this.playNext.bind(this)}>
                        <i className="icon ion-ios-fastforward"></i>
                    </div>
                </div>
                <div className="player-section player-seek">
                    <div className="player-seek-bar-wrap" onClick={this.seek.bind(this) }>
                        <div className="player-seek-bar">
                            <div className="player-seek-duration-bar" style={{ width: `${this.state.currentTime / this.state.duration * 100}%` }}>
                                <div className="player-seek-handle">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="player-time">
                        <span>{formatSeconds(this.state.currentTime) }</span>
                        <span className="player-time-divider">/</span>
                        <span>{formatSeconds(this.state.duration) }</span>
                    </div>
                </div>
                <div className="player-section">
                    <div className="player-button player-volume-button">
                        <div className="player-volume-button-wrap">
                            <i className="icon ion-android-volume-up"></i>
                            <i className="icon ion-android-volume-mute">
                            </i>
                        </div>
                    </div>
                    <div className="player-volume">
                        <div className="player-seek-bar-wrap" onClick={this.changeVolume.bind(this) }>
                            <div className="player-seek-bar">
                                <div className="player-seek-duration-bar" style={{ width: `${this.state.volume * 100}%` }}>
                                    <div className="player-seek-handle">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Player);

