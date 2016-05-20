import * as React from 'react';
import {connect} from "react-redux";
import {Link} from 'react-router';
import { Modal, ModalContent } from '../components/modal';
import * as $player from "../actions/player";
import * as $session from "../actions/session";
import * as $add from "../actions/add";

import Player from "../components/player";
import Button from '../components/button';
import Content from '../components/content';
import LoginModal from '../components/login/login-modal';
import Logo from '../components/logo';
import Navigator from '../components/navigator';
import NavigatorItem from '../components/navigator-item';

import AddModal from '../components/addModal';


function mapStateToProps(state) {
    return {
        player: state.player,
        session: state.session,
        add: state.add
    };
}
function mapDispatchToProps(dispatch) {
    return {
        login: (): void => dispatch($session.login()),
        toogle: () => dispatch($player.toogleMianPlayer()),
        showAddModal: () => dispatch($add.showAddModal(true)),
        filter: (s) => dispatch($player.filter(s))
    };
}
interface IAppProps extends React.Props<any> {
    player: any,
    session: any,
    add: any,
    toogle: () => void;
    login: () => void;
    filter: (s) => void;
    showAddModal: () => void;
}

/**
 * App
 */
class App extends React.Component<IAppProps, {}> {
    state = {
        showAddModal: false
    }
    filter() {
        var searchBox = this.refs["searchBox"] as HTMLInputElement;
        this.props.filter(searchBox.value);
    }
    onImport() {
        var self = this;
        var s = document.createElement("input");
        s.type = "file";
        s.onchange = function (e) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var str = e.target['result'];
                var musics = JSON.parse(str);
                $player.importMusic(musics);
            }
            reader.readAsText(s.files.item(0));
        }
        s.click();
        setTimeout(function () {
            s.remove();
        }, 1000);
    }

    render() {
        let {children, session, add, filter, player, login, toogle, showAddModal} = this.props;
        let isLoggedIn = session.token != null;
        return (<div>
            <LoginModal
                onSubmit={ login }
                isPending={ session.isLoading || false }
                hasError={ session.hasError || false }
                isVisible={ !isLoggedIn }
                errorMessage={session.errorMessage} />
            <AddModal />
            <Navigator>
                <NavigatorItem mr>
                    <Logo/>
                </NavigatorItem>
                <div className="flex flex-auto"></div>
                <NavigatorItem mr isVisible={isLoggedIn}>
                    <input placeholder="search" ref="searchBox" type="text" value={player.filter} onChange={this.filter.bind(this) }/>
                </NavigatorItem>
                <NavigatorItem mr isVisible={isLoggedIn}>
                    <a download={`playlist-${new Date().valueOf()}.json`} href={`data:application/octet-stream,${JSON.stringify([...player.playlist].reverse())}`} target="_blank">Export</a>
                </NavigatorItem>
                <NavigatorItem mr isVisible={isLoggedIn}>
                    <a href="#add" onClick={this.onImport.bind(this)}>Import</a>
                </NavigatorItem>
                <NavigatorItem mr isVisible={isLoggedIn}>
                    <a href="#add" onClick={showAddModal}>Add</a>
                </NavigatorItem>
                <NavigatorItem mr isVisible={isLoggedIn}>
                    <label>
                        <input type="checkbox" onChange={toogle} checked={player.mainPlayer}/>
                        Main
                    </label>
                </NavigatorItem>
                <NavigatorItem mr isVisible={isLoggedIn}>
                    <b>{session.token}</b>
                </NavigatorItem>
            </Navigator>
            <Content isVisible={isLoggedIn}>
                {children}
                {player.mainPlayer ? <Player></Player> : null}
            </Content>
        </div>);
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);