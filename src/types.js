import type { Component } from 'react';

export type ModalDisplayInfo = {
  component: Component<*>,
  props: Object,
  stackOrder?: number,
  onBackdropClick?: Function,
}

export type ModalIdentifier = number
