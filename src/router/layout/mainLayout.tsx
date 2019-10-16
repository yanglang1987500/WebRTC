import React from "react";
import { Switch, Route, Redirect, RouteComponentProps } from "react-router-dom";
import { mainRouterList } from "./config";
import { inject } from "mobx-react";
import "./mainLayout.less";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";

class MainLayout extends React.Component<IMainLayoutProps, IMainLayoutStates> {

  shouldComponentUpdate(prevProps: IMainLayoutProps) {
    const { location } = this.props;
    return location.pathname !== prevProps.location.pathname || location.search !== prevProps.location.search;
  }

  render() {
    const { location } = this.props;
    return (
      <div className="body_wrapper">
        <CSSTransitionGroup
          component="div"
          className="transition-group"
          transitionName={`fade`}
          transitionEnter={true}
          transitionLeave={true}
          transitionEnterTimeout={250}
          transitionLeaveTimeout={250}
        >
          <Switch key={location.pathname} location={location}>
            {mainRouterList.map(config => (
              <Route exact key={config.path} path={config.path} component={config.component} title={config.title} />
            ))}
            <Route key="unmatch" component={() => <Redirect to="/" />} />
          </Switch>
        </CSSTransitionGroup>
      </div>
    );
  }
}

interface IMainLayoutProps extends RouteComponentProps {}

interface IMainLayoutStates {}

export default MainLayout;
