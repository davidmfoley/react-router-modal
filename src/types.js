import type { Component } from 'react';

export type ModalDisplayInfo = {
  component?: Component<*>,
  children?: any,
  props: Object,
  stackOrder?: number,
  onBackdropClick?: Function,
}

export type ModalIdentifier = number
