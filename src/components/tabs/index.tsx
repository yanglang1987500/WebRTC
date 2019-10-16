import React from 'react';
import classnames from 'classnames';

class Tabs extends React.Component<ITabsProps, ITabsStates> {

  static Tab: typeof Tab;

  state = {
    selectedIndex: 0
  };

  render() {
    const { children, className, onClick } = this.props;
    return <React.Fragment>
      <ul className={classnames("nav", className)} onClick={onClick}>
      {React.Children.map(children, (Value: Tab, index) => {
        return <li className="nav-item">
          <a
            href="javascript:void(0)"
            onClick={() => { this.setState({ selectedIndex: index }); }}
            className={classnames("nav-link", this.state.selectedIndex === index && "active")}
          >
            <i className={`${Value.props.icon} icon`} />{Value.props.tab}
          </a>
        </li>;
      })}
      </ul>
      <div className="tab-content" onClick={onClick}>
      {React.Children.toArray(children)[this.state.selectedIndex]}
      </div>
    </React.Fragment>;
  }
}

class Tab extends React.Component<ITabProps> {
  render() {
    const { children } = this.props;
    return <div>{children}</div>;
  }
}

interface ITabsProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

interface ITabsStates {
  selectedIndex: number;
}

interface ITabProps {
  icon?: string;
  tab: string | React.ReactNode;
}

Tabs.Tab = Tab;

export default Tabs;