import * as React from "react";
import { preloadScript } from "opentok-react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from './store';

import './index.css';
import MainRoutes from './common/Routes';
class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="fill-in-screen">
            <MainRoutes />
          </div>
        </BrowserRouter>
      </Provider>
    )
  }
}

export default preloadScript(App);