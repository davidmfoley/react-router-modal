// @flow
import React from 'react';  // eslint-disable-line no-unused-vars
import { Route, withRouter } from 'react-router-dom';
import Modal from './modal';

type Props = {
  match: { url: string },
  history: { push: Function },
  parentPath?: string,
  path: string,
  children?: any,
  component?: any,
  exact?: boolean,
  props?: any,
  className?: string,
  parentPath?: string | (match: { url: string }) => string,
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
*
* @param {String} props.className class name to apply to modal container
* @param {Children} props.children modal content can be specified as chld elements
* @param {ReactElement} props.component modal content can be specified as a component type
* @param {Object} props.props Props to be passed to the react component specified by the component property.
*
*
* When the route matches, the modal is shown.
* If multiple routes match, the modals will be stacked based on the length of the path that is matched.
*
*/
function ModalRoute({ path, parentPath, className, children, component, exact, props, match, history }: Props): React.Element<*> {

  const navToParent = () => {
    if (typeof(parentPath) === 'function') {
      return history.push(parentPath(match));
    }
    history.push(parentPath || match.url);
  };

  return (
    <Route path={path} exact={exact} render={({match, location, history}) => (
      <Modal
        component={component}
        children={children}
        props={{...props, match, location, history}}
        className={className}
        stackOrder={getStackOrder(match)}
        onBackdropClick={navToParent}
      />
    )} />
  );
}

export default withRouter(ModalRoute);
