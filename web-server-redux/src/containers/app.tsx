import * as React from 'react';
import {connect} from "react-redux";
import {Link} from 'react-router';

import Player from "../components/player";


function mapStateToProps(state) {    
   return state;
}

interface IAppProps extends React.Props<any>{
    player:any,
    login:()=>void;
    logout:()=>void;
}

/**
 *  App
 */
class  App extends React.Component<IAppProps,void> {
    render(){
        let {children,player} =this.props;
        return (<div>
            <h1>title</h1>
            <div>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
            </div>
            <div>
                {children}
            </div>
            <Player text={player.text}></Player>
        </div>);
    }    
}
export default connect(mapStateToProps)(App);