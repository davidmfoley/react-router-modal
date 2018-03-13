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
  onLastModalUnmounted?: Function,
  onFirstModalMounted?: Function,
  autoRestoreScrollPosition?: boolean,
  children?: any,
}

type State = {
  scrollX: number,
  scrollY: number,
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
 * @param {Function} [props.onFirstModalMounted] handler invoked when first modal is shown
 * @param {Function} [props.onLastModalUnmounted] handler invoked when last modal is hidden
 * @param {boolean} [props.autoRestoreScrollPosition=true] Automatically restore the window scroll position when the last modal is unmounted. This is useful in cases where you have made the body position fixed on small screen widths, usually to work around mobaile browser scrolling behavior. Set this to false if you do not want this behavior.
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
    scrollX: 0,
    scrollY: 0,
    setIds: []
  }

  static defaultProps = {
    autoRestoreScrollPosition: true,
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
    const { onFirstModalMounted, onLastModalUnmounted, autoRestoreScrollPosition } = this.props;
    let nextState: any = {setIds};
    const anyModalsBefore = !!this.state.setIds.length;
    const anyModalsAfter = !!setIds.length;

    const showingFirstModal = anyModalsAfter && !anyModalsBefore;
    const hidingLastModal = !anyModalsAfter && anyModalsBefore;
    const supportsScrollFix = (typeof window !== 'undefined' && typeof window.scroll === 'function');
    const shouldAutoScroll = autoRestoreScrollPosition && supportsScrollFix;

    if (showingFirstModal) {
      if (shouldAutoScroll) {
        nextState.scrollX = window.scrollX;
        nextState.scrollY = window.scrollY;
      }
      this.afterRender = onFirstModalMounted;
    }
    else if (hidingLastModal) {
      this.afterRender = () => {
        if (shouldAutoScroll) {
          window.scroll(this.state.scrollX, this.state.scrollY);
        }

        if (onLastModalUnmounted) {
          onLastModalUnmounted();
        }
      };
    }

    this.setState(nextState);
  }

  afterRender: ?Function

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

    if (
      typeof window !== 'undefined' &&
      typeof window.requestAnimationFrame !== 'undefined'
      && this.afterRender
    ) {
      window.requestAnimationFrame(this.afterRender);
      this.afterRender = null;
    }

    return (
      <div>
        {setIds.map(id => <ModalSetContainer key={id}
          setId={id}
          backdropClassName={backdropClassName}
          containerClassName={containerClassName}
          modalClassName={modalClassName}
        />)}
      </div>
    );
  }
}

