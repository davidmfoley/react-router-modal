// @flow
import React from 'react';  // eslint-disable-line no-unused-vars
import { Link, withRouter } from 'react-router-dom';
import ModalRoute from './modal_route';

type Props = {
  match: { url: string },
  history: { push: Function },
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
    modalClassName
  } = props;

  return (
    <Link to={path} className={linkClassName}>
      {children}
      <ModalRoute
        exact={exact}
        path={path}
        component={component}
        className={modalClassName}
      />
    </Link>
  );
}

export default withRouter(ModalLink);
