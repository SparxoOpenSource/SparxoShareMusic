import * as React from 'react';
import {connect} from 'react-redux';
import {play, remove, init} from '../actions/player';

function mapStateToProps(state) {
  return state.player
}

function mapDispatchToProps(dispatch) {
  return {
    play: (id) => dispatch(play(id)),
    remove: (id) => dispatch(remove(id)),
    init: (): void => dispatch(init())
  };
}

interface IListProps extends React.Props<any> {
  playSong: any;
  filter: string;
  playlist: Array<any>;
  play: (id) => void;
  remove: (id) => void;
  init: () => void;
};

class List extends React.Component<IListProps, void> {
  componentDidMount() {
    this.props.init();
  }
  render() {
    const {play, filter, remove, playSong, playlist} = this.props;
    return <div className="flex flex-wrap">
      {playlist.map(d => {
        if (d.name.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) > -1) {
          return (
            <div key={d.id} className="col">
              <div key={d.id} className="card">
                <div className="card-info">
                  <div className="card-image" style={{ backgroundImage: `url(${d.image})` }}>
                    {
                      (playSong && d.id == playSong.id) ? (
                        <div className="card-btn-play playing">
                          <i className="icon ion-radio-waves"></i>
                        </div>
                      ) : (
                          <div className="card-btn-play" onClick={play.bind(null, d.id) }>
                            <i className="icon ion-ios-play"></i>
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
                      <a href="javascript:;" onClick={remove.bind(null, d.id) }>
                        <i className="icon ion-trash-a"></i>
                      </a>
                      <div className="clearfix"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>);
        }
      }) }
    </div>;
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(List);