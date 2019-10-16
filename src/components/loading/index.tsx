import React from 'react';
import classnames from 'classnames';
import { Spin } from '@components';

import './index.less';

const Loading = (props: ILoadingProps) => {
  const { children, height, show = false, spinStyle = {}, className } = props;

  return (<div style={{ height: height ? height : '100%' }} className='loader-wrap'>
    <div className={classnames('loader-spin-inner', className)} style={{ display: show ? 'block' : 'none' }}>
      <Spin className='spin' style={spinStyle} />
    </div>
    {children}
  </div>);
};

interface ILoadingProps {
  children?: React.ReactNode;
  height?: string | number;
  show: boolean;
  spinStyle?: Object;
  className?: string;
}

export default Loading;

const PlaceholderLoading = (props: ILoadingProps) => {
  const { height, show = false, spinStyle = {}, className } = props;
  return (<div style={{ height: height ? height : '100%', display: show ? 'block' : 'none' }} className='loader-wrap'>
    <div className={classnames('loader-spin-inner', className)} >
      <Spin className='spin' style={spinStyle} />
    </div>
  </div>);
};

export { PlaceholderLoading };
