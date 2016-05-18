import * as React from 'react';
import {connect} from "react-redux";
import {Link} from 'react-router';

import * as $session from "../actions/session";

import Player from "../components/player";
import Button from '../components/button';
import Content from '../components/content';
import LoginModal from '../components/login/login-modal';
import Logo from '../components/logo';
import Navigator from '../components/navigator';
import NavigatorItem from '../components/navigator-item';

function mapStateToProps(state) {
    return {
        player: state.player,
        session: state.session
    };
}
function mapDispatchToProps(dispatch) {
    return {
        login: (): void => dispatch($session.login())
    };
}
interface IAppProps extends React.Props<any> {
    player: any,
    session: any,
    login: () => void;
}

/**
 *  App
 */
class App extends React.Component<IAppProps, void> {
    render() {
        let {children, session, player, login} = this.props;
        let isLoggedIn = session.token != null;
        return (<div>

            {isLoggedIn ? null : <LoginModal
                onSubmit={ login }
                isPending={ session.isLoading || false }
                hasError={ session.hasError || false }
                isVisible={ !isLoggedIn }
                errorMessage={session.errorMessage} />
            }
            <Navigator>
                <NavigatorItem mr>
                    <Logo/>
                </NavigatorItem>
                <NavigatorItem  mr isVisible={isLoggedIn}>
                    <Link to="/">Home</Link>
                </NavigatorItem>
                <NavigatorItem mr isVisible={isLoggedIn}>
                    <Link to="/add">Add</Link>
                </NavigatorItem>
                <div className="flex flex-auto"></div>
                <NavigatorItem mr isVisible={isLoggedIn}>
                    <b>{session.token}</b>
                </NavigatorItem>
            </Navigator>
            <Content isVisible={isLoggedIn}>
                {children}
                <Player></Player>
            </Content>
        </div>);
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);