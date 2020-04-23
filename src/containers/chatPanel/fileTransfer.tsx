import React from 'react';
import { inject, observer } from 'mobx-react';
import { Line } from 'rc-progress';
import { FileTransferBusiness, IFileTransferBusinessProps } from '@business/fileTransfer';
import { toJS } from 'mobx';
import { TransferStatus } from '@common/enums/base';
import { Dot } from '@components';

@inject(FileTransferBusiness)
@observer
class FileTransfer extends React.Component<IFileTransfeProps, IFileTransfeStates> {

  render() {
    const { receiveFileQueue, sendFileQueue, acceptFile, downloadFile, deleteFile, clearSendFile } = this.props;
    if (toJS(receiveFileQueue).length === 0 && toJS(sendFileQueue).length === 0)
      return null;
    return <div className="chat-tab-file-transfer">
      <ul>
      {receiveFileQueue.map(transfer => {
        return <li>
          <p title={transfer.name}>{transfer.name}</p>
          {transfer.status !== TransferStatus.Wait && <Line percent={transfer.progress*100} strokeWidth={3} strokeColor="#0BD318" />}
          {transfer.status === TransferStatus.Wait && <p>
              <span className="button" onClick={() => acceptFile(transfer.id, true)}>接收</span>
              <span className="button" onClick={() => acceptFile(transfer.id, false)}>拒绝</span>
            </p>}
          {transfer.status === TransferStatus.Complete && <p>
            <span className="button" onClick={() => downloadFile(transfer.id)}>下载</span>
            <span className="button" onClick={() => deleteFile(transfer.id)}>删除</span>
          </p>}
        </li>
      })}
      {sendFileQueue.map(transfer => {
        return <li>
          <p title={transfer.name}>{transfer.name}</p>
          {transfer.status !== TransferStatus.Wait && <Line percent={transfer.progress*100} strokeWidth={3} strokeColor="#0BD318" />}
          {transfer.status === TransferStatus.Wait && <p>等待对方接收<Dot /></p>}
          {transfer.status === TransferStatus.Complete && <p>
            <span className="button" onClick={() => clearSendFile(transfer.id)}>清除</span>
          </p>}
        </li>
      })}
      </ul>
    </div>;
  }
}

interface IFileTransfeProps extends Partial<IFileTransferBusinessProps> {
}

interface IFileTransfeStates {
}

export default FileTransfer;