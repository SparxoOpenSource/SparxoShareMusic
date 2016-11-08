

import * as React from 'react';

import { browserHistory, Router } from 'react-router';
import { Provider } from 'react-redux';



export class AppContainer extends React.Component<any, {}> {
    static propTypes = {
        routes: React.PropTypes.object.isRequired,
        store: React.PropTypes.object.isRequired
    };
    shouldComponentUpdate() {
        return false;
    }
    render() {
        const { routes, store } = this.props;
        return (
            <Provider store={store}>
                <Router history={browserHistory} children={routes} />
            </Provider>
        );
    }
};
