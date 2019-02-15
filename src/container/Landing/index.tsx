import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { MenuItem, Menu } from 'semantic-ui-react';

export default class Landing extends React.Component<RouteComponentProps, {}> {
  render() {
    return (
      <div>
        <Menu>
          <MenuItem>
            <a href="/teacher">TEACHER</a>
          </MenuItem>
          <MenuItem>
            <a href="/student">STUDENT</a>
          </MenuItem>
        </Menu>
      </div>
    )
  }
}