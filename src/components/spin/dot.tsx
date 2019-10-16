import React from 'react';
import classnames from 'classnames';

class Dot extends React.Component<IDotProps, IDotStates> {

  timer: number;

  state = {
    dots: 1
  };

  componentDidMount() {
    const { interval = 500, dots = 3 } = this.props;
    this.timer = window.setInterval(
      () => {
        this.setState({ dots: this.state.dots === dots ? 1: this.state.dots + 1 });
      },
      interval);
  }

  componentWillUnmount() {
    window.clearInterval(this.timer);
  }

  render() {
    return <span>{Array(this.state.dots).fill('.').join('')}</span>;
  }
}

interface IDotProps {
  interval?: number;
  dots?: number;
}

interface IDotStates {
  dots: number;
}

export default Dot;