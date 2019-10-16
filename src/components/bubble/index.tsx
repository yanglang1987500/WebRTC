import React from 'react';
import classnames from 'classnames';

const Bubble = ({
  children,
  size = 'middle',
  type = ''
}: IBubbleProps) =>
  <span className={classnames("circle-icon-text", type, size)}>{children}</span>;

export default Bubble;

interface IBubbleProps {
  size?: string;
  type?: string;
  children: React.ReactNode;
}