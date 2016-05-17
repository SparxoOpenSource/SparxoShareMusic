import * as React from 'react';
import {connect} from "react-redux";
import {Link} from 'react-router';

interface IAppProps extends React.Props<any>{
    session:any,
    login:()=>void;
    logout:()=>void;
}


/**
 *  App
 */
class  App extends React.Component<IAppProps,void> {    
    render(){
        let {children} =this.props;
        return (<div>
            <h1>title</h1>
            <div>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
            </div>
            <div>
                {children}
            </div>
        </div>);
    }    
}
export default connect()(App);