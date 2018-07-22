// @flow
import React from 'react';  // eslint-disable-line no-unused-vars
import { Route, withRouter } from 'react-router-dom';
import Modal from './modal';

type Match  = { url: string, params: any }

type Props = {
  match: Match,
  history: { push: Function },
  onBackdropClick?: Function,
  path: string,
  children?: any,
  component?: any,
  exact?: boolean,
  props?: Object,
  className?: string,
  parentPath?: string | (match: Match) => string,
  backdropClassName?: string,
  backdropInClassName?: string,
  backdropOutClassName?: string,
  inClassName?: string,
  outClassName?: string,
  outDelay?: number,
}


function getStackOrder(match) {
  // order routed modals behind any directly instantiated modals
  return match.url.length - 10000;
}

/**
* A react-router Route that shows a modal when the location pathname matches.
*
* @param {Object} props
* @param {String} props.path path to match
* @param {Boolean} props.exact If set, only show modal if route exactly matches path.
* @param {String} props.parentPath path to navigate to when backdrop is clicked
* @param {String} props.onBackdropClick Handler to invoke when backdrop is clicked. If set, overrides the navigation to parentPath, so you need to handle that yourself.
*
* @param {String} props.className class name to apply to modal container
*
* @param {Children} props.children modal content can be specified as chld elements
* @param {ReactComponent} props.component modal content can be specified as a component type. The component will be passed `parentPath` and `closeModal` props, in addition to the specified props, and the withRouter props.
*
* @param {Object} props.props Props to be passed to the react component specified by the component property.

* @param {String} [props.inClassName=react-router-modal__modal--in] class name applied to modal immediately after it is shown to allow for css transitions
* @param {String} [props.outClassName=react-router-modal__modal--out] class name applied to modal before modal is hidden to allow for css transitions
* @param {String} [props.backdropClassName=react-router-modal__backdrop] class name applied to backdrop
* @param {String} [props.backdropInClassName=react-router-modal__backdrop--in] class name applied to backdrop immediately after it is shown to allow for css transitions
* @param {String} [props.backdropOutClassName=react-router-modal__backdrop--out] class name applied to backdrop before modal is hidden to allow for css transitions
* @param {String} [props.outDelay=0] delay, in milliseconds to wait when closing modal, to allow for css transitions to complete before ripping it out of the DOM
*
* When the route matches, the modal is shown.
* If multiple routes match, the modals will be stacked based on the length of the path that is matched.
*
* The component rendered in the modal will receive the following props:
*
* @param {string} parentPath - Either the parentPath specified in the ModalRoute, or a calculated value based on matched url
* @param {string} closeModal A convenience method to close the modal by navigating to the parentPath
*/
function ModalRoute(routeProps: Props): any {
  const {
    path,
    parentPath,
    exact,
    props,
    onBackdropClick
  } = routeProps;

  const modalProps = { ...routeProps };

  delete modalProps.exact;
  delete modalProps.path;
  delete modalProps.parentPath;
  delete modalProps.onBackdropClick;
  delete modalProps.props;

  const getParentPath = (match: Match): string => {
    if (typeof(parentPath) === 'function') {
      return parentPath(match);
    }
    if (parentPath) return parentPath;
    if (match.params[0]) return match.params[0];
    if (match.params[0] === '') return '/';
    return match.url;
  }

  return (
    <Route path={path} exact={exact} render={({match, location, history}) => (
      <Modal
        {...modalProps}
        props={{
          ...props,
          match,
          location,
          history,
          parentPath: getParentPath(match),
          closeModal: () => history.push(getParentPath(match))
        }}
        stackOrder={getStackOrder(match)}
        onBackdropClick={onBackdropClick || (() => history.push(getParentPath(match)))}
      />
    )} />
  );
}

export default withRouter(ModalRoute);
