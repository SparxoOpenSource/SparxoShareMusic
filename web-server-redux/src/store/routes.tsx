import * as React from 'react';
import { IndexRoute, Route } from 'react-router';

import App from '../containers/app';
import List from  '../containers/list';

export default (
    <Route path="/" component={ App }>
        <IndexRoute component={ List } />
    </Route>
);
