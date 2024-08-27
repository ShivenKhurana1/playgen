import { ReactElement } from 'react';
import { X } from 'react-feather';
import Modal from 'react-modal';
import { media, style } from 'typestyle';

import { Colors, mobile } from './util';

const containerStyle = style(
  {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: 20,
    position: 'relative',
  },
  media(mobile, { padding: '12px 0' })
);

export function CustomModal(props: { modalOptions: ReactModal.Props; title: string; children: ReactElement }) {
  // Shared modal options
  const modalOptions = {
    style: {
      content: {
        maxHeight: 'calc(95vh - 40px)',
        maxWidth: 550,
        background: Colors.Black,
        position: undefined,
        margin: 20,
      },
      overlay: { background: 'rgba(26,23,23,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    },
    bodyOpenClassName: 'modal-open',
    appElement: document.querySelector('.App') || undefined,
  };

  return (
    <Modal {...props.modalOptions} {...modalOptions}>
      <div className={containerStyle}>
        <X
          onClick={props.modalOptions.onRequestClose}
          style={{ position: 'absolute', top: -10, right: -10, cursor: 'pointer', padding: 4, background: 'rgba(25, 20, 20, 0.85)' }}
        />

        <h2 style={{ marginTop: 0, textAlign: 'center' }}>{props.title}</h2>

        {props.children}
      </div>
    </Modal>
  );
}
