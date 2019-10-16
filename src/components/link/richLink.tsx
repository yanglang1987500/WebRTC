import React from 'react';

const RichLink = ({
  linkable,
  href,
  className,
  children,
  target,
}: IABFeatureProps) => linkable ?
  <a href={href} className={className} target={target}>
    {children}
  </a> : <React.Fragment>{children}</React.Fragment>;

interface IABFeatureProps {
  linkable?: boolean;
  href?: string;
  className?: string;
  target?: string;
  children?: React.ReactNode;
}

export default RichLink;