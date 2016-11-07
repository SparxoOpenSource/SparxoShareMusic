import * as React from 'react'
import * as ReactDOM from 'react-dom'

import createStore from './store/createStore';
import createRoutes from './routes';

import { AppContainer } from './containers/AppContainer';

// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.___INITIAL_STATE__;
const store = createStore(initialState);
// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root')

let render = () => {
    var routes = createRoutes(store);
    ReactDOM.render(
        <AppContainer store={store} routes={routes} />,
        MOUNT_NODE
    )
}

// ========================================================
// Developer Tools Setup
// ========================================================
if (__DEV__) {
    if (window.devToolsExtension) {
        window.devToolsExtension.open()
    }
}
// This code is excluded from production bundle
if (__DEV__) {
    if (module.hot) {
        // Development render functions
        const renderApp = render
        const renderError = (error) => {
            const RedBox: any = require<{ default: any }>('redbox-react').default;
            ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
        }

        // Wrap render in try/catch
        render = () => {
            try {
                renderApp()
            } catch (error) {
                renderError(error)
            }
        }

        // Setup hot module replacement
        module.hot.accept('./routes', () =>
            setImmediate(() => {
                ReactDOM.unmountComponentAtNode(MOUNT_NODE)
                render()
            })
        )
    }
}

// ========================================================
// Go!
// ========================================================
render()
