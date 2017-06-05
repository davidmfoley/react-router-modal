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
