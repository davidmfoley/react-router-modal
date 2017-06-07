// @flow
import React from 'react';
import { mountModal, updateModal, unmountModal } from './modal_container';

type Props = {
  component?: any,
  children?: any,
  props?: Object,
  stackOrder?: number,
  className?: string,
  onBackdropClick?: Function
}

type State = {
  id?: string
}

export default class Modal extends React.Component {
  props: Props
  state: State

  componentDidMount() {
    const { className, children, component, stackOrder, props, onBackdropClick } = this.props;
    this.setState({
      id: mountModal({
        component,
        children,
        props: props || {},
        stackOrder,
        onBackdropClick,
        className
      })
    });
  }

  componentWillReceiveProps(next: Props) {
    const { className, children, component, stackOrder, props, onBackdropClick } = next;

    updateModal(this.state.id, {
      component,
      children,
      props: props || {},
      stackOrder,
      onBackdropClick,
      className
    });
  }

  componentWillUnmount() {
    unmountModal(this.state.id);
  }

  render() {
    return null;
  }
}

