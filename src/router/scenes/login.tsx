import React from "react";
import classnames from "classnames";
import { inject, observer } from "mobx-react";
import { Spin, Button, Input } from "@components";
import { RouteComponentProps } from "react-router";
import { ChatCenterBusiness, IChatCenterBusinessProps } from "@business/chatCenter";

@inject(ChatCenterBusiness)
@observer
class Login extends React.Component<ILoginProps, ILoginStates> {

  state: ILoginStates = {
    name: '',
    error: null
  }

  submit = () => {
    const { join } = this.props;
    if (this.state.name.trim() === '') {
      this.setState({ error: '名字不能为空' });
      return;
    }
    join(this.state.name); 
  }

  render() {
    return (
      <div className="chat-login">
        <p>请取一个名字：</p>  
        {this.state.error && <p style={{ color: '#F75924' }}>{this.state.error}</p>}
        <Input value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} onKeyDown={e => e.keyCode === 13 && this.submit()} />
        <Button onClick={this.submit} style={{ width: '100%' }}>加入</Button>
      </div>
    );
  }
}

interface ILoginProps extends Partial<IChatCenterBusinessProps>, RouteComponentProps  {}

interface ILoginStates {
  name: string;
  error: string;
}

export default Login;
