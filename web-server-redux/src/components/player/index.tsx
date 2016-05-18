import * as React from 'react';
import {connect} from 'react-redux';
import {init} from '../../actions/player';

function mapStateToProps(state) {
    return state.player
}

function mapDispatchToProps(dispatch) {
    return {
        init: (): void => dispatch(init()),
    };
}
interface IPlayerProps extends React.Props<any> {
    init: () => void;
    playSong:any;
};

/**
 *  Player extends React.C
 */
class Player extends React.Component<IPlayerProps, void> {
    componentDidMount() {
        console.log('1231');
        this.props.init();
    }
    render() {
        var {playSong} =this.props
        return <div className="player fixed bottom-0 left-0 right-0">
            {playSong.name}        
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);

// function Player({text}: IPlayerProps) {      
// }