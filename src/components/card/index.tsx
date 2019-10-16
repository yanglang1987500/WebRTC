import React from 'react';
import classnames from 'classnames';

class Card extends React.Component<ICardProps, ICardStates> {

  render() {
    const { vertical = true, className, children } = this.props;
    const childs = React.Children.toArray(children);
    let subNode = null;
    if (!vertical) {
      subNode = <div className="row">
        {childs.map((child, index) => (
          <div
            className={`col-md-${12 / childs.length} col-sm-12 ${index > 0 ? 'border-left-line' : ''}`}
          >
            <div className="card-body">
              {child}
            </div>
          </div>))}
      </div>;
    } else {
      subNode = <div className="card-body">
        {children}
      </div>;
    }
    return <div className={classnames("card", className)}>
      {subNode}
    </div>;
  }
}

interface ICardProps {
  vertical?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface ICardStates {
}

export default Card;