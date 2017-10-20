// @flow
import React from 'react';

import type {
  ModalDisplayInfo,
} from './types';

type Props = ModalDisplayInfo & {
  context: { setId: any }
}

export default class ModalWithBackdrop extends React.Component<*> {
  props: Props

  getChildContext() {
    return this.props.context;
  }

  static childContextTypes = {
    setId: () => {}
  }

  render() {
    const {
      children,
      component,
      props,
      onBackdropClick,
      backdropClassName,
      modalClassName
    } = this.props;

    const Component = component;

    return (
      <div>
        <div className={backdropClassName || ''} onClick={onBackdropClick} />
        <div className={modalClassName || ''}>
          {!Component && children}
          {Component && <Component {...props} context={this.props.context}/>}
        </div>
      </div>
    );
  }
}
