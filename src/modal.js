// @flow
import React from 'react';
import { mountModal, unmountModal } from './modal_container';

type Props = {
  component: any,
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
    const { className, component, stackOrder, props, onBackdropClick } = this.props;
    this.setState({
      id: mountModal({
        component,
        props: props || {},
        stackOrder,
        onBackdropClick,
        className
      })
    });
  }

  componentWillUnmount() {
    unmountModal(this.state.id);
  }

  render() {
    return null;
  }
}

