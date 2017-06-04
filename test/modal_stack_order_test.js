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


describe('handling startup event order', () => {
  let wrapper: ReactWrapper;

  beforeEach(() => {
    wrapper = mount(
      <div>
        <Modal className='test-modal test-modal-foo' component={TestModalContent} props={{}} />
        <Modal className='test-modal test-modal-bar' component={TestModalContent} props={{}} />
        <ModalContainer />
      </div>
    );
  });

  afterEach(() => { wrapper.unmount(); });

  it('renders modals in order by mount time', () => {
    const modalWrappers = wrapper.find('.test-modal');
    expect(modalWrappers.get(0).className).to.eq('test-modal test-modal-foo');
    expect(modalWrappers.get(1).className).to.eq('test-modal test-modal-bar');
  });
});
