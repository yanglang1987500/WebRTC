import React from "react";
import classnames from "classnames";
import { type } from "@common/utils/index";
import { Type } from "@common/enums/base";

class HomeTabs extends React.Component<IHomeTabsProps, IHomeTabsStates> {
  static HomeTab: typeof HomeTab;
  dom: HTMLDivElement;
  state = {
    selectedIndex: 0
  };

  componentDidMount() {
    this.updateActive();
  }

  componentDidUpdate(prevProps: IHomeTabsProps, prevStates: IHomeTabsStates) {
    if (prevStates.selectedIndex !== this.state.selectedIndex) {
      this.updateActive();
    }
  }

  updateActive() {
    if (this.dom) {
      const cb = () => {
        this.dom && this.dom.querySelector(".tab-pane.active").classList.add("show");
      };
      setTimeout(cb, 20);
    }
  }

  render() {
    const { children, className, onClick } = this.props;
    return (
      <div className="home-tab">
        <div className={classnames("list-group", className)} onClick={onClick}>
          {React.Children.map(children, (Value: HomeTab, index) => {
            if (!Value) return;
            return (
              <a
                href="javascript:void(0)"
                onClick={() => {
                  this.setState({ selectedIndex: index });
                }}
                className={classnames(
                  "list-group-item list-group-item-action",
                  this.state.selectedIndex === index && "active"
                )}
                data-behavior={Value.props.behavior}
              >
                {type(Value.props.icon) === Type.String ? (
                  <i className={`${Value.props.icon} iconfont mr-2`} />
                ) : (
                  Value.props.icon
                )}
                {type(Value.props.icon) === Type.String ? Value.props.tab : (
                  <span>{Value.props.tab}</span>
                )}
              </a>
            );
          })}
        </div>
        <div className="tab-content" onClick={onClick} ref={dom => (this.dom = dom)}>
          {React.Children.map(children, (child, index) => {
            return <div className={`tab-pane fade ${this.state.selectedIndex === index ? "active" : ""}`}>{child}</div>;
          })}
        </div>
      </div>
    );
  }
}

class HomeTab extends React.Component<IHomeTabProps> {
  render() {
    const { children } = this.props;
    return <div>{children}</div>;
  }
}

interface IHomeTabsProps {
  children: React.ReactNode;
  className?: string;
  behavior?: string;
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

interface IHomeTabsStates {
  selectedIndex: number;
}

interface IHomeTabProps {
  icon?: string | React.ReactNode;
  tab: string | React.ReactNode;
  behavior?: string;
}

HomeTabs.HomeTab = HomeTab;

export default HomeTabs;
