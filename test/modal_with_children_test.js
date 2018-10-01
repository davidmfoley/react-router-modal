// @flow
import React from 'react'; //eslint-disable-line
import { describe, it, afterEach, beforeEach } from 'mocha';
import { mount, ReactWrapper } from 'enzyme';
import ModalContainer from '../src/modal_container';
import Modal from '../src/modal';
import chai from 'chai';

let expect = chai.expect;

describe('Modal with children', () => {
  function Wrapper({showModal}: {showModal?: boolean}) {
    return (
      <div>
        { showModal && <Modal className='test-modal'>
          What
        </Modal> }
        <ModalContainer backdropClassName='test-backdrop-class-name' />
      </div>
    );
  }

  let wrapper: ReactWrapper;

  beforeEach(() => { wrapper = mount(<Wrapper />); });
  afterEach(() => { wrapper.unmount(); });

  describe('with a modal', () => {
    beforeEach(() => {
      wrapper.setProps({showModal: true});
      wrapper.update();
    });

    it('renders modal content', () => {
      const modal = wrapper.find('div.test-modal');

      expect(modal.length).to.eq(1);
      expect(modal.at(0).html()).to.contain('What');
    });
  });
});
