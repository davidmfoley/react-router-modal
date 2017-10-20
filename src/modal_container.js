// @flow
import React from 'react';

import type {
  ModalIdentifier,
} from './types';

import {
  setModalSetIdsHandler,
  clearModalSetIdsHandler
} from './modal_controller';

import ModalSetContainer from './modal_set_container';

type Props = {
  containerClassName?: string,
  backdropClassName?: string,
  modalClassName?: string,
  bodyModalOpenClassName?: string,
  children?: any,
}

type State = {
  setIds: ModalIdentifier[]
}

/**
 * Container for rendered modals.
 *
 * This should be included in your react app as one of the last elements before the closing body tag.
 * When modals are rendered, they live inside this container.
 * When no modals are shown, nothing is rendered into the DOM.
 *
 * @param {Props} props
 * @param {String} [props.modalClassName=react-router-modal__modal] class name to apply to modals
 * @param {String} [props.backdropClassName=react-router-modal__backdrop] class name to apply to modal backdrops
 * @param {String} [props.containerClassName=react-router-modal__container] class name to apply to the container itself
 * @param {String} [props.bodyModalClassName=react-router-modal__modal-open] class name to apply to the <body /> when any modals are shown
 *
 * @example <caption>Using default class names</caption>
 *
 * <ModalContainer />
 *
 * @example <caption>Overriding the default class names</caption>
 *
 * <ModalContainer
 *   bodyModalOpenClassName='modal-open'
 *   containerClassName='modal-container'
 *   backdropClassName='modal-backdrop'
 *   modalClassName='modal'
 * />
 *
 *
 * @example <caption>DOM structure</caption>
 * // Note that modals are made "modal" via CSS styles, and end up rendered like the following in the DOM (with two modals, for example):
 * <div className={containerClassName}>
 *   <div>
 *     <div className={backdropClassName} />
 *     <div className={modalClassName}>
 *       .. bottom-most modal contents ..
 *     </div>
 *   </div>
 *   <div>
 *     <div className={backdropClassName} />
 *     <div className={modalClassName}>
 *       .. top-most modal contents ..
 *     </div>
 *   </div>
 * </div>
 *
 */
export default class ModalContainer extends React.Component<Props, State> {
  props: Props
  state: State = {
    setIds: []
  }

  static defaultProps = {
    modalClassName: 'react-router-modal__modal',
    backdropClassName: 'react-router-modal__backdrop',
    containerClassName: 'react-router-modal__container',
    bodyModalOpenClassName: 'react-router-modal__modal-open'
  }

  componentDidMount() {
    setModalSetIdsHandler(this.onSetIds);
  }

  componentWillUnmount() {
    clearModalSetIdsHandler();
  }

  onSetIds = (setIds: number[]) => {
    this.setState({setIds});
  }

  render() {
    const {
      backdropClassName,
      containerClassName,
      bodyModalOpenClassName,
      modalClassName,
    } = this.props;


    const { setIds } = this.state;

    if (typeof document !== 'undefined') {
      if (setIds.length === 0) {
        document.body && bodyModalOpenClassName && document.body.classList.remove(bodyModalOpenClassName);
      }
      else {
        document.body && bodyModalOpenClassName && document.body.classList.add(bodyModalOpenClassName);
      }
    }

    return (
      <div>
        {setIds.map(id => <ModalSetContainer
          key={id}
          setId={id}
          backdropClassName={backdropClassName}
          containerClassName={containerClassName}
          modalClassName={modalClassName}
        />)}
      </div>
    );
  }
}

