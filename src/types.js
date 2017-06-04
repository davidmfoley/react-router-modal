import type { Component } from 'react';

export type ModalDisplayInfo = {
  component: Component<*>,
  props: Object,
  stackOrder?: number,
}

export type ModalIdentifier = number
