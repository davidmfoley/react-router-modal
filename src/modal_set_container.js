// @flow
import type {
  ModalIdentifier,
  MountedModal
} from './types';

import React from 'react';
import ModalWithBackdrop from './modal_with_backdrop';
import getAriaProps from './get_aria_props';

import {
  setModalSetHandler,
  clearModalSetHandler
} from './modal_controller';

type Props = {
  setId: ModalIdentifier,
  containerClassName?: string,
  backdropClassName?: string,
  backdropInClassName?: string,
  backdropOutClassName?: string,
  wrapperClassName?: string,
  modalClassName?: string,
  modalInClassName?: string,
  modalOutClassName?: string,
  outDelay?: number,
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
      backdropInClassName,
      backdropOutClassName,
      containerClassName,
      modalClassName,
      modalInClassName,
      modalOutClassName,
      wrapperClassName,
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
          backdropClassName={m.info.backdropClassName || backdropClassName}
          outDelay={typeof m.info.outDelay === 'undefined' ? this.props.outDelay : m.info.outDelay}
          backdropInClassName={m.info.backdropInClassName || backdropInClassName}
          backdropOutClassName={m.info.backdropOutClassName || backdropOutClassName}
          containerClassName={containerClassName}
          modalClassName={m.info.className || modalClassName}
          modalInClassName={m.info.inClassName || modalInClassName}
          modalOutClassName={m.info.outClassName || modalOutClassName}
          onBackdropClick={m.info.onBackdropClick}
          wrapperClassName={wrapperClassName}
          component={m.info.component}
          props={m.info.props || {}}
          isOut={!!m.info.out}
          context={{setId: m.id}}
          {...getAriaProps(m.info)}
        />)}
      </div>
    );
  }
}

