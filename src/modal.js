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

/**
* Renders its contents in a modal div with a backdrop.
* Use Modal if you want to show a modal without changing the route.
*
* The content that is shown is specified by *either* the "component" prop, or by
* child elements of the Modal.
*
* @param {Object} props
* @param {Number} props.stackOrder order to stack modals, higher number means "on top"
* @param {String} props.className class name to apply to modal container
* @param {Children} props.children Modal content can be specified as chld elements
* @param {Component} props.component React component to render in the modal.
* @param {Object} props.props props to pass to the react component specified by the component property
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

export default class Modal extends React.Component {
  props: Props
  state: State = {}

  componentWillMount() {
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

