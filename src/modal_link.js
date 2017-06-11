// @flow
import React from 'react';  // eslint-disable-line no-unused-vars
import { Link, withRouter } from 'react-router-dom';
import ModalRoute from './modal_route';

type Props = {
  match: {url: string},
  path: string,
  children?: any,
  component?: any,
  exact?: boolean,
  props?: any,
  modalClassName?: string,
  linkClassName?: string,
  parentPath?: string | (match: { url: string }) => string,
}

/**
* Link and ModalRoute in one convenient component
* Renders a link that, when clicked, will navigate to the route that shows the modal.
*
* @param {Object} props
* @param {String} props.path path to match
* @param {Boolean} props.exact If set, only show modal if route exactly matches path.
* @param {String} props.parentPath path to navigate to when backdrop is clicked
*
* @param {String} props.linkClassName class name to apply to <Link />
* @param {String} props.modalClassName class name to apply to modal container
* @param {Children} props.children Link contents. Note that Modal content must be specified by the component property.
* @param {ReactComponent} props.component Component to render in the modal.
* @param {Object} props.props Props to be passed to the react component specified by the component property.
*
*
* @example <caption>Example ModalLink</caption>
*
* <ModalLink path='/hello' component={HelloComponent}>
*   Say Hello
* </ModalLink>
*/
function ModalLink(props: Props): any {
  const {
    exact,
    path,
    children,
    component,
    linkClassName,
    match,
    parentPath,
    modalClassName
  } = props;

  return (
    <Link to={path} className={linkClassName}>
      {children}
      <ModalRoute
        exact={exact}
        path={path}
        props={props.props}
        component={component}
        className={modalClassName}
        parentPath={parentPath || match.url}
      />
    </Link>
  );
}

export default withRouter(ModalLink);
