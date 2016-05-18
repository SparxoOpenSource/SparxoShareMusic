import * as React from 'react';
import {connect} from 'react-redux';
import {play,remove,init} from '../actions/player';

function mapStateToProps(state) {
  return state.player
}

function mapDispatchToProps(dispatch) {
  return {
    play: (id) => dispatch(play(id)),
    remove: (id) => dispatch(remove(id)),
  };
}

interface IHomeProps extends React.Props<any> {
  playSong: any;
  playlist: Array<any>;
  play: (id) => void;
  remove:(id)=>void;
};

class Home extends React.Component<IHomeProps, void> {

  render() {
    const {play,remove, playSong, playlist} = this.props;
    return <div className="flex flex-wrap justify-center">
      {playlist.map(d => {
        return (<div key={d.id} className="card">
          <div className="card-info">
            <div className="card-image" style={{ backgroundImage: `url(${d.image})` }}>
              {
                (playSong != null && d.id == playSong.id) ? (
                  <div className="card-btn-play playing">播放中...</div>
                ) : (
                    <div className="card-btn-play" onClick={play.bind(null, d.id) }>
                      播放
                    </div>
                  )
              }

            </div>
            <div className="card-footer">
              <div className="card-name">
                {d.name}
              </div>
              <div className="card-user">
                {d.orderer}
                <a href="javascript:;" onClick={remove.bind(null,d.id)}>删</a>
              </div>
            </div>
          </div>
        </div>);
      }) }
    </div>;
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Home);