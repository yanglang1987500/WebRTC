import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import "./mainLayout.less";

class LoginLayout extends React.Component<ILoginLayoutProps, ILoginLayoutStates> {
  render() {
    return (
      <React.Fragment>
        <div className="login-banner" />
        <div className="sms-one" />

        <Switch>
         
          <Route component={() => <Redirect to="/account/login" />} />
        </Switch>
      </React.Fragment>
    );
  }
}

interface ILoginLayoutProps { }

interface ILoginLayoutStates { }

export default LoginLayout;
