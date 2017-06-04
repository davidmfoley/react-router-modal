// @flow
import React from 'react';  // eslint-disable-line no-unused-vars
import { Route, withRouter } from 'react-router-dom';
import Modal from './modal';

type Props = {
  match: { url: string },
  history: { push: Function },
  path: string,
  component: any,
  exact?: boolean,
  props?: any,
  className?: string
}

function getStackOrder(match) {
  // order routed modals behind any directly instantiated modals
  return match.url.length - 10000;
}

function ModalRoute({ path, className, component, exact, props, match, history }: Props): React$Element<*> {
  const Component = component;

  const parentPath = match.url;
  const navToParent = () => {
    history.push(parentPath);
  };

  return (
    <Route path={path} exact={exact} render={({match, location, history}) => (
      <Modal
        component={component}
        props={{...props, match, location, history}}
        className={className}
        stackOrder={getStackOrder(match)}
        onBackdropClick={navToParent}
      />
    )} />
  );
}

export default withRouter(ModalRoute);
