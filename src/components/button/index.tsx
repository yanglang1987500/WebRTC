import React from "react";
import classnames from 'classnames';
import './index.less';

export const Button = (props: IButton) => {
  const { className, icon, disabled, loading = false, children, onClick } = props;

  return <button
    className={classnames("btn btn-dark btn-sm btn-material-icon", className)}
    style={{ marginRight: 5 }}
    onClick={onClick}
    disabled={disabled}
  >
    {loading && <i className='button_loading' />}
    {icon}
    {children}
  </button>;
};

export const ButtonGroup = (props: IButtonGroup) => {
  const { children } = props;
  return <div className="search-group">{children}</div>;
};

interface IButtonGroup {
  children?: React.ReactNode;
}

interface IButton {
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  onClick?(): void;
}
