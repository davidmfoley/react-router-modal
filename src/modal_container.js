// @flow
import React from 'react';
import type { ModalDisplayInfo, ModalIdentifier } from './types';

let nextIdValue: ModalIdentifier = 0;

type MountedModal = {
  id: ModalIdentifier,
  info: ModalDisplayInfo
}

type ModalsHandler = (modals: MountedModal[]) => void;

let modals: MountedModal[] = [];

function warnNoContainer(modals) {
  console.error(`No <ModalContainer /> found when mounting <Modal />`);
}

let notifyChanged: ModalsHandler = warnNoContainer

function clearHandler() {
  notifyChanged = () => {};
}
function setHandler(handler: ModalsHandler) {
  notifyChanged = handler;
}

function nextId() : ModalIdentifier {
  return nextIdValue++;
}

export function mountModal(info: ModalDisplayInfo): ModalIdentifier {
  const id = nextId();
  modals.push({
    id,
    info
  });
  notifyChanged(modals);
  return id;
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
}

type State = {
  modals: ModalDisplayInfo[]
}

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

  onModals(modals: ModalDisplayInfo[]) {
    this.setState({modals});
  }

  getSortedModals(): ModalDisplayInfo {
    const sorted = [...this.state.modals];
    sorted.sort(this.compareModals);
    return sorted;
  }

  compareModals(a: ModalDisplayInfo, b: ModalDisplayInfo): number {
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

    if (modals.length === 0) {
      document.body && bodyModalOpenClassName && document.body.classList.remove(bodyModalOpenClassName);
      return null;
    }

    document.body && bodyModalOpenClassName && document.body.classList.add(bodyModalOpenClassName);

    return (
      <div className={containerClassName}>
        {modals.map(m => <ModalWithBackdrop
          key={m.id}
          backdropClassName={backdropClassName}
          containerClassName={containerClassName}
          modalClassName={m.info.className || modalClassName}
          component={m.info.component}
          props={m.info.props || {}}
        />)}
      </div>
    );
  }
}

function ModalWithBackdrop({component, props, backdropClassName, modalClassName}) {
  const Component = component;
  return (
    <div>
      <div className={backdropClassName || ''} />
      <div className={modalClassName || ''}>
        <Component {...props} />
      </div>
    </div>
  );

}
