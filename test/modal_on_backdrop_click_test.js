// @flow
import React from 'react';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { mount, ReactWrapper } from 'enzyme';
import ModalContainer from '../src/modal_container';
import Modal from '../src/modal';
import chai from 'chai';

let expect = chai.expect;

function TestModalContent() {
  return <div></div>;
}

describe('handling click on backdrop', () => {
  let wrapper: ReactWrapper;
  let clicked: boolean;

  function onBackdropClick() {
    clicked = true;
  }

  beforeEach(() => {
    clicked = false;

    wrapper = mount(
      <div>
        <Modal className='test-modal test-modal-foo' component={TestModalContent} props={{}} onBackdropClick={onBackdropClick} />
        <ModalContainer backdropClassName='test-backdrop' />
      </div>
    );
  });

  afterEach(() => { wrapper.unmount(); });

  it('invokes handler when clicked', () => {
    expect(clicked).to.eq(false);
    const backdrop = wrapper.find('.test-backdrop');

    backdrop.simulate('click');
    expect(clicked).to.eq(true);
  });
});
