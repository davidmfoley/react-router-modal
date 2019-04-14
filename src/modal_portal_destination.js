// @flow
import React from 'react';

type PortalProps = {
  className: string,
  ariaProps: Object,
  onRef: Function,
  isOut: boolean,
  frozenContent?: string
};

type PortalState = { container?: any };

export default class ModalPortalDestination extends React.Component<PortalProps, PortalState> {
  props: PortalProps;
  state = {}

  onDiv = (container: any) => {
    if (!this.state.container) {
      this.setState({ container });
      this.props.onRef(container);
    }
  }

  componentWillUnmount() {
    const { container } = this.state;
    if (container && container.parentNode) {
      // IE lacks element.remove() ...
      container.parentNode.removeChild(container);
    }
  }

  render() {
    const {
      className,
      ariaProps,
    } = this.props;

    if (this.props.frozenContent) {
      return  (
        <div
          className={className}
          role='dialog'
          aria-modal={true}
          {...ariaProps}
          dangerouslySetInnerHTML={{ __html: this.props.frozenContent }}
        />
      )
    }

    return (
      <div
        className={className}
        role='dialog'
        aria-modal={true}
        {...ariaProps}
        ref={this.onDiv}
      />
    );
  }
}
