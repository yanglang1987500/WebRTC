import React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { Spin } from '@components';
import classnames from 'classnames';

class ScrollList extends React.Component<IScrollListProps, IScrollListStates> {
  scroll: Scrollbars;

  onScroll = (event: React.UIEvent<any>) => {
    const { loadMore, loading } = this.props;
    if (loading) return;
    if (this.scroll.getClientHeight() + this.scroll.getScrollTop() + 2 >= this.scroll.getScrollHeight()) {
      loadMore();
      this.scroll.scrollToBottom();
    }
  };
  isLoaded = false;

  render() {
    const {
      children,
      loadMore,
      height = 500,
      minHeight = 450,
      autoHide = true,
      loading = false,
      loadingComponent = (
        <Spin
          strokeWidth={5}
          width={25}
          style={{ margin: '20px auto', height: React.Children.count(children) === 0 ? 200 : 'auto' }}
        />
      )
    } = this.props;
    return (
      <Scrollbars
        ref={dom => {
          this.scroll = dom;
        }}
        renderThumbHorizontal={() => <div style={{ width: 0 }} />}
        autoHeightMax={height}
        autoHeightMin={minHeight}
        autoHide={autoHide}
        autoHeight
        onScroll={this.onScroll}
        onUpdate={values => {
          if (!values.clientHeight || !values.scrollHeight) return;
          if (
            React.Children.count(children) > 0 &&
            values.clientHeight >= values.scrollHeight &&
            values.scrollTop === 0 &&
            !this.isLoaded
          ) {
            this.isLoaded = true;
            loadMore();
          }
        }}
      >
        {children}
        {loading && loadingComponent}
      </Scrollbars>
    );
  }
}

interface IScrollListProps {
  height?: number;
  loading: boolean;
  minHeight?: number;
  autoHide?: boolean;

  loadingComponent?: React.ReactNode;
  loadMore: () => void;
}

interface IScrollListStates {}

export default ScrollList;
