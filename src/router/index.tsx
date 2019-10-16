import React, { Component, ReactComponentElement } from "react";
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";
import MainLayout from "./layout/mainLayout";
import LoginLayout from "./layout/loginLayout";
const NoMatch = () => {
  // no match go home.
  return <div>not found</div>;
};

const Router = () => {
  return (
    <React.Suspense fallback={null}>
      <HashRouter>
        <Switch>
          <Route path="/account" render={props => <LoginLayout {...props} />} />
          <Route path="/" render={props => <MainLayout {...props} />} />
          <Route component={NoMatch} />
        </Switch>
      </HashRouter>
    </React.Suspense>
  );
};

export default Router;
