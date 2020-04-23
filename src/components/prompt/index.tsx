import * as React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

class Prompt extends React.Component<IPromptProps, IPromptState> {
  node: React.RefObject<any> = React.createRef();
  state: IPromptState = {
    showPrompt: false
  };

  constructor(props: IPromptProps) {
    super(props);
  }

  componentDidMount() {
    this.show();
  }

  show = () => {
    const { duration = 3000 } = this.props.config;
    setTimeout(() => {
      this.setState({
        showPrompt: true
      });
    });
    if (duration !== -1) {
      setTimeout(() => {
        this.close();
      }, duration);
    }
  };

  close = () => {
    this.setState({
      showPrompt: false
    });
    this.props.onClose(this.props.config.id);
  };

  render() {
    const { title = 'Success', message = '' } = this.props.config;
    return (
      <div className={classnames('prompt', this.state.showPrompt ? 'slide-show' : null)} ref={this.node}>
        <div className="card rounded-0">
          <div className="card-header p-2">
            <b>{title}</b>
            <a className="prompt-close" href="javascript:void(0)" onClick={() => this.close()}>
              <i className="mdi-navigation-close fs16" />
            </a>
          </div>
          <div className="card-body fs13 p-2">{message}</div>
        </div>
      </div>
    );
  }
}

class PromptManager extends React.Component<IPromptManagerProps, IPromptManagerState> {
  constructor(props: IPromptManagerProps) {
    super(props);
    this.state = {
      configArray: []
    };
  }

  ref = React.createRef();

  componentDidMount() {
    if (!window.promptManager) {
      window.promptManager = {
        instance: this,
        show: (config: Object) => {
          this.setState((preState, props) => {
            preState.configArray.push({ ...config, id: Math.random() });

            return {
              configArray: preState.configArray
            };
          });
        },
        showWrongInfo(msg) {
          this.show({
            title: 'Something was wrong!',
            message: msg
          });
        }
      };
    }
  }

  closePrompt = (id: number) => {
    this.setState((preState, props) => {
      return {
        configArray: preState.configArray.filter(config => config.id !== id)
      };
    });
  };

  render() {
    const { configArray } = this.state;
    if (window.promptManager && window.promptManager.instance !== this) {
      return null;
    }
    return ReactDOM.createPortal(
      <div>
        {configArray.map(config => (
          <Prompt key={config.id} config={config} onClose={this.closePrompt} />
        ))}
      </div>,
      document.body
    );
  }
}

declare let window: ClientWindow;

interface ClientWindow extends Window {
  promptManager: { instance: PromptManager; show: (config: Object) => void; showWrongInfo: (msg: string) => void };
}

interface IPromptProps {
  config: IConfig;
  onClose: (id: number) => void;
}

interface IPromptState {
  showPrompt: boolean;
}

interface IConfig extends IKeyValueMap {
  id: number;
}

interface IPromptManagerProps {}

interface IPromptManagerState {
  configArray: IConfig[];
}

export default PromptManager;
