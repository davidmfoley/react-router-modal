// @flow
import React from 'react';
import getAriaProps from './get_aria_props';
import { containerCreated } from './modal_controller';

import type {
  ModalDisplayInfo,
  ModalIdentifier
} from './types';

type Props = ModalDisplayInfo & {
  modalId: ModalIdentifier,
  context: { setId: any }
}

type State = {
  rendered: boolean
}

export default class ModalWithBackdrop extends React.Component<Props, State> {
  props: Props
  state: State = { rendered: false };
  done = false;

  getChildContext() {
    return this.props.context;
  }

  static childContextTypes = {
    setId: () => {}
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!this.done && !this.state.rendered) {
          this.setState({
            rendered: true
          });
        }
      });
    });
  }

  componentWillUnmount() {
    this.done = true;
  }

  getClassName(mainClassName?: string, inClassName?: string, outClassName?: string) {
    const names: string[] = [mainClassName || ''];
    if (this.state.rendered && !this.props.isOut) names.push(inClassName || '');
    if (this.props.isOut) names.push(outClassName || '');
    return names.filter(n => !!n).join(' ') || '';
  }

  render() {
    const {
      onBackdropClick,
      backdropClassName,
      backdropInClassName,
      backdropOutClassName,
      modalClassName,
      modalInClassName,
      modalOutClassName,
      wrapperClassName,
    } = this.props;

    const calculatedBackdropClassName = this.getClassName(backdropClassName, backdropInClassName, backdropOutClassName);
    const calculatedModalClassName = this.getClassName(modalClassName, modalInClassName, modalOutClassName);

    const ariaProps = getAriaProps(this.props);

    return (
      <div className={wrapperClassName}>
        <div className={calculatedBackdropClassName} onClick={onBackdropClick} />
        <ModalPortalDestination
         className={calculatedModalClassName}
         ariaProps={ariaProps}
         onRef={(ref) => containerCreated(this.props.modalId, ref)}
        />
      </div>
    );
  }
}

type PortalProps = {
  className: string,
  ariaProps: Object,
  onRef: Function,
};
type PortalState = { container?: any };

class ModalPortalDestination extends React.Component<PortalProps, PortalState> {
  props: PortalProps;
  state = {}

  onDiv = (container) => {
    if (!this.state.container) {
      this.setState({ container });
      this.props.onRef(container);
    }
  }

  componentWillUnmount() {
    if (this.state.container) {
      this.state.container.remove();
    }
  }

  render() {
    const {
      className,
      ariaProps,
    } = this.props;

    return (
      <div
        className={className}
        role='dialog'
        aria-modal={true}
        {...ariaProps}
        ref={this.onDiv}
      />
    );
  }
}
