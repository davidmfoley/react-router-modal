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
}


function getStackOrder(match) {
  // order routed modals behind any directly instantiated modals
  return match.url.length - 10000;
}

/**
* A react-router Route that shows a modal when the location pathname matches.
*
* The component rendered in the modal will receive the following props:
*
* @param {string} parentPath - Either the parentPath specified in the ModalRoute, or a calculated value based on matched url
* @param {string} closeModal A convenience method to close the modal by navigating to the parentPath
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
*
*
* When the route matches, the modal is shown.
* If multiple routes match, the modals will be stacked based on the length of the path that is matched.
*
*/
function ModalRoute({ path, parentPath, className, children, component, exact, props, onBackdropClick }: Props): any {
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
        component={component}
        children={children}
        props={{
          ...props,
          match,
          location,
          history,
          parentPath: getParentPath(match),
          closeModal: () => history.push(getParentPath(match))
        }}
        className={className}
        stackOrder={getStackOrder(match)}
        onBackdropClick={onBackdropClick || (() => history.push(getParentPath(match)))}
      />
    )} />
  );
}

export default withRouter(ModalRoute);
