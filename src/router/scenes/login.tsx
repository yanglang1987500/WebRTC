import React from "react";
import classnames from "classnames";
import { inject, observer } from "mobx-react";

@observer
class Login extends React.Component<ILoginProps, ILoginStates> {

  render() {
    return (
      <div>I am login</div>
    );
  }
}

interface ILoginProps  {}

interface ILoginStates {}

export default Login;
