// @flow
import React from 'react';
import getAriaProps from './get_aria_props';
import type {
  ModalDisplayInfo,
} from './types';

type Props = ModalDisplayInfo & {
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
        if (!this.done && !this.rendered) {
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
      children,
      component,
      props,
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

    const Component = component;

    const ariaProps = getAriaProps(this.props);

    return (
      <div className={wrapperClassName}>
        <div className={calculatedBackdropClassName} onClick={onBackdropClick} />
        <div
         className={calculatedModalClassName}
         role='dialog'
         aria-modal={true}
         {...ariaProps}
        >
          {!Component && children}
          {Component && <Component {...props} context={this.props.context}/>}
        </div>
      </div>
    );
  }
}
