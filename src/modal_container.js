// @flow
import React from 'react';

import type {
  ModalIdentifier,
} from './types';

import {
  setModalSetIdsHandler,
  clearModalSetIdsHandler,
  setDefaultOutDelay
} from './modal_controller';

import ModalSetContainer from './modal_set_container';

type Props = {
  containerClassName?: string,
  backdropClassName?: string,
  backdropInClassName?: string,
  backdropOutClassName?: string,
  modalClassName?: string,
  modalInClassName?: string,
  modalOutClassName?: string,
  wrapperClassName?: string,
  outDelay?: number,
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
 * @param {String} [props.modalInClassName=react-router-modal__modal--in] class name applied to modal immediately after it is shown to allow for css transitions
 * @param {String} [props.modalOutClassName=react-router-modal__modal--out] class name applied to modal before modal is hidden to allow for css transitions
 * @param {String} [props.backdropInClassName=react-router-modal__backdrop--in] class name applied to backdrop immediately after it is shown to allow for css transitions
 * @param {String} [props.backdropOutClassName=react-router-modal__backdrop--out] class name applied to backdrop before modal is hidden to allow for css transitions
 * @param {String} [props.modalWrapperClassName=react-router-modal__wrapper] class name applied to backdrop before modal is hidden to allow for css transitions
 * @param {String} [props.outDelay=0] delay, in milliseconds to wait when closing modal, to allow for css transitions to complete before ripping it out of the DOM
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
    modalInClassName: 'react-router-modal__modal--in',
    modalOutClassName: 'react-router-modal__modal--out',
    backdropClassName: 'react-router-modal__backdrop',
    backdropInClassName: 'react-router-modal__backdrop--in',
    backdropOutClassName: 'react-router-modal__backdrop--out',
    containerClassName: 'react-router-modal__container',
    wrapperClassName: 'react-router-modal__wrapper',
    bodyModalOpenClassName: 'react-router-modal__modal-open'
  }

  componentDidMount() {
    setModalSetIdsHandler(this.onSetIds);
    setDefaultOutDelay(this.props.outDelay || 0);
  }

  componentWillUnmount() {
    clearModalSetIdsHandler();
  }

  componentWillReceiveProps(next: Props) {
    if (next.outDelay !== this.props.outDelay) {
      setDefaultOutDelay(next.outDelay || 0);
    }
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
      backdropInClassName,
      backdropOutClassName,
      containerClassName,
      bodyModalOpenClassName,
      modalClassName,
      modalInClassName,
      modalOutClassName,
      wrapperClassName,
      outDelay
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
          outDelay={outDelay}
          wrapperClassName={wrapperClassName}
          backdropClassName={backdropClassName}
          backdropInClassName={backdropInClassName}
          backdropOutClassName={backdropOutClassName}
          containerClassName={containerClassName}
          modalClassName={modalClassName}
          modalInClassName={modalInClassName}
          modalOutClassName={modalOutClassName}
        />)}
      </div>
    );
  }
}

