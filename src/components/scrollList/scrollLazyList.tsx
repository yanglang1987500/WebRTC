import React from "react";
import { type } from "@common/utils/index";
import { Type } from "@common/enums/base";
import ScrollList from "./scrollList";

class ScrollLazyList extends React.Component<
  IScrollLazyListProps,
  IScrollLazyListStates
> {
  timer: number;

  constructor(props: IScrollLazyListProps) {
    super(props);
    this.state = {
      countToDisplay: props.initial || 10,
      loading: false
    };
  }

  componentWillUnmount() {
    window.clearTimeout(this.timer);
  }

  loadMore = () => {
    const { increment = 5, interval = 1000 } = this.props;
    const isEnded = this.state.countToDisplay >= this.props.data.length;
    if (isEnded) return;
    this.setState({
      loading: true
    });
    const unLoading = () => {
      this.setState({
        loading: false,
        countToDisplay: this.state.countToDisplay + increment
      });
    };
    this.timer = window.setTimeout(unLoading, interval);
  }

  render() {
    const { children, height = 500, data = [], noData } = this.props;
    if (type(children) !== Type.Function) {
      throw new Error("ScrollLazyList children must be callback function.");
    }
    const render = (children as any) as Function;
    const list = data
      .slice(0, this.state.countToDisplay)
      .map(item => render(item));
    const isLoading = this.state.loading || this.props.isLoading;

    const isNoData = !isLoading && list.length <= 0;
    if (isNoData) return noData;
    return (
      <ScrollList height={height} loading={isLoading} loadMore={this.loadMore}>
        {list}
      </ScrollList>
    );
  }
}

interface IScrollLazyListProps {
  height?: number;
  data: IKeyValueMap[];
  initial?: number;
  increment?: number;
  interval?: number;
  isLoading?: boolean;
  noData: React.ReactNode;
}

interface IScrollLazyListStates {
  countToDisplay?: number;
  loading?: boolean;
}

export default ScrollLazyList;
