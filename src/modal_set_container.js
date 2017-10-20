// @flow
import type {
  ModalIdentifier,
  MountedModal
} from './types';

import React from 'react';
import ModalWithBackdrop from './modal_with_backdrop';

import {
  setModalSetHandler,
  clearModalSetHandler
} from './modal_controller';

type Props = {
  setId: ModalIdentifier,
  containerClassName?: string,
  backdropClassName?: string,
  modalClassName?: string,
  children?: any,
}

type State = {
  modals: MountedModal[]
}

export default class ModalSetContainer extends React.Component<Props, State> {
  props: Props
  state: State = {
    modals: []
  }

  componentDidMount() {
    setModalSetHandler(this.props.setId, this.onModals);
  }

  componentWillUnmount() {
    clearModalSetHandler(this.props.setId);
  }

  onModals = (modals: MountedModal[]) => {
    this.setState(({ modals }: any));
  }

  render() {
    const {
      backdropClassName,
      containerClassName,
      modalClassName,
    } = this.props;

    const { modals } = this.state;

    if (modals.length === 0) {
      return null;
    }

    return (
      <div className={containerClassName}>
        {modals.map(m => <ModalWithBackdrop
          key={m.id}
          children={m.info.children}
          backdropClassName={backdropClassName}
          containerClassName={containerClassName}
          modalClassName={m.info.className || modalClassName}
          onBackdropClick={m.info.onBackdropClick}
          component={m.info.component}
          props={m.info.props || {}}
          context={{setId: m.id}}
        />)}
      </div>
    );
  }
}

