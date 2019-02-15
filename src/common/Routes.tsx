import * as React from 'react';

import { Route, Switch } from 'react-router-dom';
import VideoContainer from 'src/container/VideoContainer';
import Landing from 'src/container/Landing';

const Routes  = [
  <Route key={0} exact={true} path="/" component={Landing} />,
  <Route key={1} exact={true} path="/teacher" component={VideoContainer} />,
  <Route key={2} exact={true} path="/student" component={VideoContainer} />,
];

const MainRoutes = () => (
  <Switch>
    {Routes}
  </Switch>
);

export default MainRoutes;