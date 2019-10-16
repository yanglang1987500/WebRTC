import React from 'react';
import classnames from 'classnames';
import OutClick from '@common/utils/outClick';
import './index.less';

class DropDown extends React.Component<IDropDownProps, IDropDownStates> {
  
  private outClick: { clear: Function };
  panel: HTMLDivElement;

  state: IDropDownStates = {
    show: false
  };
  
  componentDidMount() {
    this.outClick = OutClick.init(this.panel, () => {
      if (this.state.show) {
        this.setState({ show: false });
      }
    });
  }
  
  componentWillUnmount() {
    this.outClick && this.outClick.clear();
  }
  
  onToggle = () => {
    this.setState({ show: !this.state.show });
  }

  render() {
    const { children, className } = this.props;
    const childs = React.Children.toArray(children);
    return <div ref={dom => this.panel = dom}>
      <a className={classnames("dropdown-toggle", className)} onClick={this.onToggle} href="javascript:void(0)">
        {childs[0]}
      </a>
      <div className={classnames("dropdown-menu navbar-dropdown", this.state.show && 'show')}>
        {childs[1]}
      </div>
    </div>;
  }
}

/** like bootstrap dropdown toggle */
interface IDropDownProps{
  /** two parts: 1, show dots; 2, dropdown panel */
  children: React.ReactNode;
  className?: string;
}

interface IDropDownStates{
  show: boolean;
}

export default DropDown;