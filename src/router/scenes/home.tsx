import React from "react";
import classnames from "classnames";
import { inject, observer } from "mobx-react";
import Chat from "@containers/chat";
import { Localstorage } from "@common/utils/storage";
import { CHAT_GUID_KEY } from "@common/enums/constant";
import { RouteComponentProps } from "react-router";
import { Spin } from "@components";
import { ChatCenterBusiness, IChatCenterBusinessProps } from "@business/chatCenter";

@inject(ChatCenterBusiness)
@observer
class Home extends React.Component<IHomeProps, IHomeStates> {

  async componentDidMount() {
    const { history, setId, join, id, fetchMessages } = this.props;
    if (id) return;
    const guid = Localstorage.read(CHAT_GUID_KEY);
    if (!guid) {
      history.push('/login');
      return;
    }
    setId(guid);
    join('', guid);
  }

  render() {
    const { id, getUserById } = this.props;
    const self = getUserById(id);
    return (
    <section>{ self ? <Chat /> : <Spin style={{ height: 500 }} />}</section>
    );
  }
}

interface IHomeProps extends RouteComponentProps, Partial<IChatCenterBusinessProps> {}

interface IHomeStates {
  show: boolean;
}

export default Home;
