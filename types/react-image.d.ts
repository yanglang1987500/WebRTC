export = index;
declare class index {
  static propTypes: {};
  constructor(props: any);
  componentDidMount(): void;
  componentWillReceiveProps(nextProps: any): any;
  componentWillUnmount(): void;
  forceUpdate(callback: any): void;
  render(): any;
  setState(partialState: any, callback: any): void;
}
declare namespace index {
  namespace defaultProps {
    function container(x: any): any;
    const decode: boolean;
    const loader: boolean;
    const src: any[];
    const unloader: boolean;
  }
}
