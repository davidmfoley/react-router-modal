import type { Component } from 'react';

export type ModalDisplayInfo = {
  setId: ModalIdentifier,
  component?: Component<*>,
  children?: any,
  props: Object,
  stackOrder?: number,
  onBackdropClick?: Function,
  outDelay?: number
}

export type ModalIdentifier = number

export type MountedModal = {
  id: ModalIdentifier,
  info: ModalDisplayInfo
}

export type ModalSetsHandler = (parentIds: ModalIdentifier[]) => void;
export type ModalSetHandler = (modals: MountedModal[]) => void;
