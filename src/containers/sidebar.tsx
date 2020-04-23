import React from 'react';
import classnames from 'classnames';
import { inject, observer } from 'mobx-react';
import { ChatCenterBusiness, IChatCenterBusinessProps } from '@business/chatCenter';

@inject(ChatCenterBusiness)
@observer
class SideBar extends React.Component<ISideBarProps, ISideBarStates> {

  render() {
    const { users, setActiveUser, chatUserId, getMessage, id, logout } = this.props;
    return <div className="chat-sidebar">
      <ul>
        {users.map(user => <li
          key={user.id}
          className={classnames({
            'active': user.id === chatUserId,
            'unread': (() => {
              const m = getMessage(user.id, id);
              return m && m.unread;
            })()
          })}
          onClick={() => setActiveUser(user.id)}>
          {user.name}
        </li>)}
      </ul>
      <i className="icon icon-logout" title="退出" onClick={() => logout()} />
    </div>;
  }
}

interface ISideBarProps extends Partial<IChatCenterBusinessProps> {
}

interface ISideBarStates {
}

export default SideBar;