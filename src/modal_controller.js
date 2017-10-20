// @flow
import type {
  ModalDisplayInfo,
  ModalIdentifier,
  MountedModal,
  ModalSetHandler,
  ModalSetsHandler,
} from './types';

let nextIdValue: ModalIdentifier = 1;
let hasContainer = false;

let modalSets: { [id: any]: MountedModal[] } = {};

let setHandlers: { [id: any]: ModalSetHandler } = {};
let setIdsHandler: ModalSetsHandler = () => {};

export function resetAll() {
  modalSets = {};
  setHandlers = {};
}

export function setModalSetIdsHandler(handler: ModalSetsHandler) {
  hasContainer = true;
  setIdsHandler = handler;
  handler(getSetIds());
}

export function clearModalSetIdsHandler() {
  setIdsHandler = () => {};
}

export function setModalSetHandler(id: ModalIdentifier, handler: ModalSetHandler) {
  hasContainer = true;
  setHandlers[id] = handler;
  handler(modalSets[id] || []);
}

export function clearModalSetHandler(id: ModalIdentifier) {
  delete setHandlers[id];
}

export function mountModal(info: ModalDisplayInfo): ModalIdentifier {
  if (firstMount() && !hasContainer) {
    setTimeout(warnIfNoContainer, 1000);
  }

  const id = nextId();

  info = Object.assign({setId: 0}, info);
  const setId = info.setId;

  let notifySetIds = false;
  if (!modalSets[setId]) {
    modalSets[setId] = [];
    notifySetIds = true;
  }

  modalSets[setId].push({id, info, setId});
  modalSets[setId].sort(compareModals);

  if (notifySetIds) {
    setIdsHandler(getSetIds());
  }

  if (setHandlers[setId]) {
    setHandlers[setId](modalSets[setId]);
  }

  return id;
}

export function updateModal(id: ModalIdentifier, info: ModalDisplayInfo): void {
  const setIds = getSetIds();
  let foundSetId: ModalIdentifier;
  setIds.forEach(setId => {
    modalSets[setId] = modalSets[setId].map(modal => {
      if (modal.id === id) {
        foundSetId = setId;
        return { id, info };
      }
      return modal;
    });
  });

  if (typeof foundSetId === 'undefined') {
    console.log('react-router-modal: updateModal with bad id', id); //eslint-disable-line
  }
  else {
    const handler = setHandlers[foundSetId];
    if (handler) handler(modalSets[foundSetId]);
  }
}

function getSetIds() {
  return Object.keys(modalSets).map(id => parseInt(id, 10));
}

function compareModals(a: MountedModal, b: MountedModal): number {
  const stackOrderDiff = (a.info.stackOrder || 0) - (b.info.stackOrder || 0);
  if (stackOrderDiff !== 0) return stackOrderDiff;
  return a.id - b.id;
}

export function unmountModal(id: ModalIdentifier) {
  const setIds = getSetIds();
  let foundSetId: ModalIdentifier;
  setIds.forEach(setId => {
    modalSets[setId] = modalSets[setId].filter(modal => {
      if (modal.id === id) {
        foundSetId = setId;
        return false
      }
      return true;
    });
  });

  if (typeof foundSetId !== 'undefined') {
    if (modalSets[foundSetId].length === 0) {
      delete modalSets[foundSetId];
    }
    setIdsHandler(getSetIds());
    const handler = setHandlers[foundSetId];
    if (handler) handler(modalSets[foundSetId]);
  }
}

function firstMount() {
  return nextIdValue === 0;
}

function nextId() : ModalIdentifier {
  return nextIdValue++;
}

function warnIfNoContainer() {
  if (!hasContainer) {
    console.log(`react-router-modal warning: Modal was mounted but no <ModalContainer /> found`); //eslint-disable-line
  }
}
