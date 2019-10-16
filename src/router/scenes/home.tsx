import React from "react";
import classnames from "classnames";
import { inject, observer } from "mobx-react";

@observer
class Home extends React.Component<IHomeProps, IHomeStates> {

  render() {
    return (
      <div>I am home</div>
    );
  }
}

interface IHomeProps  {}

interface IHomeStates {}

export default Home;
