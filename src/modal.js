// @flow
import React from 'react';
import { mountModal, updateModal, unmountModal } from './modal_controller';
import type { ModalIdentifier } from './types';

type Props = {
  component?: any,
  children?: any,
  props?: Object,
  stackOrder?: number,
  className?: string,
  inClassName?: string,
  outClassName?: string,
  backdropClassName?: string,
  backdropInClassName?: string,
  backdropOutClassName?: string,
  outDelay?: number,
  onBackdropClick?: Function
}

type State = {
  modalId?: string
}

type Context = {
  setId: ModalIdentifier
}

/**
 * Renders its contents in a modal div with a backdrop.
 * Use Modal if you want to show a modal without changing the route.
 *
 * The content that is shown is specified by *either* the "component" prop, or by
 * child elements of the Modal.
 * 
 *
 * @param {Object} props
 * @param {Number} props.stackOrder order to stack modals, higher number means "on top"
 * @param {Children} props.children Modal content can be specified as chld elements
 * @param {Component} props.component React component to render in the modal.
 * @param {Object} props.props props to pass to the react component specified by the component property
 * @param {Function} props.onBackdropClick handler to be invoked when the modal backdrop is clicked
 * @param {String} props.className class name to apply to modal container
 * @param {String} props.inClassName class name applied to modal immediately after it is shown to allow for css transitions
 * @param {String} props.outClassName class name applied to modal before modal is hidden to allow for css transitions
 * @param {String} props.backdropInClassName class name applied to backdrop immediately after it is shown to allow for css transitions
 * @param {String} props.backdropOutClassName class name applied to backdrop before modal is hidden to allow for css transitions
 * @param {String} props.outDelay delay, in milliseconds to wait when closing modal, to allow for css transitions to complete before ripping it out of the DOM
 *
 * @example <caption>Modals using a component and props, vs. child elements</caption>
 *
 * const Hello = ({ who }) => (<div>Hello {who}!</div>);
 *
 * // component and props
 * const ComponentExample = () => (
 *   <Modal
 *    component={Hello}
 *    props={{ who: 'World' }}
 *   />
 * );
 *
 * // using child elements
 * const ChildrenExample = () => (
 *   <Modal>
 *     <Hello who='World' />
 *   </Modal>
 * );
 *
 * @example <caption>Specifying stack order</caption>
 * <div>
 *   <Modal
 *     className='top-component-modal'
 *     component={MyTopComponent}
 *     props={ { foo: 'bar'} }
 *     stackOrder={2}
 *   />
 *   <Modal
 *     component={MyBottomComponent}
 *     props={ { bar: 'baz'} }
 *     stackOrder={1}
 *   />
 * </div>
 */

export default class Modal extends React.Component<Props, State> {
  props: Props
  state: State = {}
  context: Context

  componentWillMount() {
    this.setState({
      modalId: mountModal({
        setId: this.context.setId || 0,
        props: this.props.props || {},
        ...this.props
      })
    });
  }

  static contextTypes = {
    setId: () => { }
  }

  componentWillReceiveProps(next: Props) {
    updateModal(this.state.modalId, next);
  }

  componentWillUnmount() {
    unmountModal(this.state.modalId);
  }

  render() {
    return null;
  }
}

