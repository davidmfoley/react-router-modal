// @flow
import React from 'react';
import type { ModalDisplayInfo, ModalIdentifier } from './types';

let nextIdValue: ModalIdentifier = 0;
let hasContainer = false;

type MountedModal = {
  id: ModalIdentifier,
  info: ModalDisplayInfo
}

type ModalsHandler = (modals: MountedModal[]) => void;

let modals: MountedModal[] = [];

let notifyChanged: ModalsHandler = () => {}

function clearHandler() {
  notifyChanged = () => {};
}

function firstMount() {
  return nextId === 0;
}

function setHandler(handler: ModalsHandler) {
  hasContainer = true;
  notifyChanged = handler;
  notifyChanged(modals);
}

function nextId() : ModalIdentifier {
  return nextIdValue++;
}

function warnIfNoContainer() {
  if (!hasContainer) {
    console.log(`react-router-modal warning: Modal was mounted but no <ModalContainer /> found`); //eslint-disable-line
  }
}

export function mountModal(info: ModalDisplayInfo): ModalIdentifier {
  if (firstMount() && !hasContainer) {
    setTimeout(warnIfNoContainer, 1000);
  }

  const id = nextId();
  modals.push({
    id,
    info
  });
  notifyChanged(modals);
  return id;
}

export function updateModal(id: ModalIdentifier, info: ModalDisplayInfo): void {
  modals = modals.map(m => (
    m.id === id ? {
      id,
      info
    } : m
  ));

  notifyChanged(modals);
}

export function unmountModal(id: ModalIdentifier) {
  modals = modals.filter(m => m.id !== id);
  notifyChanged(modals);
}

type Props = {
  containerClassName?: string,
  backdropClassName?: string,
  modalClassName?: string,
  bodyModalOpenClassName?: string,
  children?: any,
}

type State = {
  modals: MountedModal[]
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

export default class ModalContainer extends React.Component {
  props: Props
  state: State ={
    modals: []
  }

  static defaultProps = {
    modalClassName: 'react-router-modal__modal',
    backdropClassName: 'react-router-modal__backdrop',
    containerClassName: 'react-router-modal__container',
    bodyModalOpenClassName: 'react-router-modal__modal-open'
  }

  componentDidMount() {
    setHandler(this.onModals.bind(this));
  }

  componentWillUnmount() {
    clearHandler();
  }

  onModals(modals: MountedModal[]) {
    this.setState({modals});
  }

  getSortedModals(): MountedModal[] {
    const sorted = [...this.state.modals];
    sorted.sort(this.compareModals);
    return sorted;
  }

  compareModals(a: MountedModal, b: MountedModal): number {
    const stackOrderDiff = (a.info.stackOrder || 0) - (b.info.stackOrder || 0);
    if (stackOrderDiff !== 0) return stackOrderDiff;
    return a.id - b.id;
  }

  render() {
    const {
      backdropClassName,
      containerClassName,
      bodyModalOpenClassName,
      modalClassName,
    } = this.props;

    const modals = this.getSortedModals();

    if (typeof document !== 'undefined') {
      if (modals.length === 0) {
        document.body && bodyModalOpenClassName && document.body.classList.remove(bodyModalOpenClassName);
      }
      else {
        document.body && bodyModalOpenClassName && document.body.classList.add(bodyModalOpenClassName);
      }
    }

    if (modals.length === 0) {
      return null;
    }
    return (
      <div className={containerClassName}>
        {modals.map(m => <ModalWithBackdrop
          key={m.id}
          children={m.info.children}
          backdropClassName={backdropClassName}
          containerClassName={containerClassName}
          modalClassName={m.info.className || modalClassName}
          onBackdropClick={m.info.onBackdropClick}
          component={m.info.component}
          props={m.info.props || {}}
        />)}
      </div>
    );
  }
}

function ModalWithBackdrop({
  children,
  component,
  props,
  onBackdropClick,
  backdropClassName,
  modalClassName
}: ModalDisplayInfo) {
  const Component = component;

  return (
    <div>
      <div className={backdropClassName || ''} onClick={onBackdropClick} />
      <div className={modalClassName || ''}>
        {!Component && children}
        {Component && <Component {...props} />}
      </div>
    </div>
  );
}
