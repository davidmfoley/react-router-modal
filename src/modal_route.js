// @flow
import React from 'react';  // eslint-disable-line no-unused-vars
import { Route } from 'react-router-dom';
import Modal from './modal';

type Props = {
  path: string,
  component: any,
  exact?: boolean,
  props?: any,
  className?: string
}

export default function ModalRoute({ path, className, component, exact, props }: Props): React$Element<*> {
  const Component = component;

  return (
    <Route path={path} exact={exact} render={({match, location, history}) => (
      <Modal component={component} props={{...props, match, location, history}} className={className} stackOrder={match.url.length}/>
    )} />
  );
}
