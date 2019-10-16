import React from 'react';
import classnames from 'classnames';

const Badge = (props: IBadgeProps) =>
  <span className={classnames("badge badge-sm", `badge-outline-${props.type}`)}>
    {props.children}
  </span>;

export default Badge;

interface IBadgeProps {
  type: string;
  children: React.ReactNode;
}