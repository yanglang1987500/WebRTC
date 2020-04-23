import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Spin } from '@components';
import { inject, observer } from 'mobx-react';
import { ChatCenterBusiness, IChatCenterBusinessProps } from '@business/chatCenter';

const Loading = <Spin style={{ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0 }} />;

const withWrap = (loader: React.LazyExoticComponent<any>) => {

  @inject(ChatCenterBusiness)
  @observer
  class Loader extends React.Component<ILoaderProps> {

    render() {
      const { wsready } = this.props;
      return wsready ? React.createElement(loader, this.props) : Loading;
    }
  }
  
  interface ILoaderProps extends RouteComponentProps, Partial<IChatCenterBusinessProps> { }
  
  class Wrapper extends React.Component<IWrapperProps> {
  
    shouldComponentUpdate() {
      return false;
    }

    render() {
      return <React.Suspense fallback={Loading}>
        {React.createElement(withRouter(Loader), this.props as any)}
      </React.Suspense>;
    }
  }
  return Wrapper;

  interface IWrapperProps extends Partial<RouteComponentProps> {}
};

export const Home = withWrap(React.lazy(() => import(
  /* webpackChunkName: 'home' */
  './home'
)));

export const Login = withWrap(React.lazy(() => import(
  /* webpackChunkName: 'account' */
  './login'
)));