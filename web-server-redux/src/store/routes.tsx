import * as React from 'react';
import { IndexRoute, Route } from 'react-router';

import App from '../containers/app';
import Home from  '../containers/home';
import Add from  '../containers/add';


export default (
    <Route path="/" component={ App }>
        <IndexRoute component={ Home } />
        <Route path="add" component={ Add }/>
    </Route>
);
