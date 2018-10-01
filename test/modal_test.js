// @flow
import React from 'react';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { mount, ReactWrapper } from 'enzyme';
import ModalContainer from '../src/modal_container';
import Modal from '../src/modal';
import chai from 'chai';

let expect = chai.expect;

function TestModalContent(props: any) {
  return <div>{props.message || 'none'}</div>;
}
describe('Modal', () => {
  function Wrapper({showModal, modalProps}: any) {
    return (
      <div>
        {showModal && (
          <Modal
            className='test-modal'
            component={TestModalContent}
            props={modalProps || {}}
          >
            <h3 id="modal-label">Exampel label</h3>
            <p id="modal-description">Example description</p>
          </Modal>
        )}
        <ModalContainer backdropClassName='test-backdrop-class-name' wrapperClassName='test-wrapper-class-name'/>
      </div>
    );
  }

  let wrapper: ReactWrapper;

  beforeEach(() => { wrapper = mount(<Wrapper />); });
  afterEach(() => {
    wrapper.unmount();
  });

  describe('with no modals', () => {
    it('renders no modals', () => {
      expect(wrapper.find('.test-backdrop-class-name').length).to.eq(0);
    });
  });

  describe('with a modal', () => {
    beforeEach(() => {
      wrapper.setProps({showModal: true});
      wrapper.update();
    });

    it('renders a backdrop', () => {
      const backdrop = wrapper.find('.test-backdrop-class-name');

      expect(backdrop.length).to.eq(1);
    });

    it('renders the correct wrapper class name', () => {
      const wrapperDiv = wrapper.find('.test-wrapper-class-name');

      expect(wrapperDiv.length).to.eq(1);
    });

    it('renders modal content', () => {
      const modal = wrapper.find('div.test-modal');

      expect(modal.length).to.eq(1);
    });

    describe('that has props change', () => {
      beforeEach(() => {
        wrapper.setProps({showModal: true, modalProps: {message: 'hello'}});
        wrapper.update();
      });

      it('passes down changed props', () => {
        const modal = wrapper.find('div.test-modal');
        expect(modal.text()).to.eq('hello');
      });

    });

    describe('that is subsequently hidden', () => {
      beforeEach(() => {
        wrapper.setProps({showModal: false});
      });

      it('removes backdrop', () => {
        wrapper.update()
        const backdrop = wrapper.find('.test-backdrop-class-name');

        expect(backdrop.length).to.eq(0);
      });

      it('removes modal', () => {
        wrapper.update()
        const backdrop = wrapper.find('.test-backdrop-class-name');

        expect(backdrop.length).to.eq(0);
      });
    });
  });
});
