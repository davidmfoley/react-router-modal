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

describe('rendering modals', () => {
  function Wrapper({showModal, modalProps}: any) {
    return (
      <div>
        { showModal && <Modal className='test-modal' component={TestModalContent} props={modalProps || {}}>
          What
        </Modal> }
        <ModalContainer backdropClassName='test-backdrop-class-name' wrapperClassName='test-wrapper-class-name'/>
      </div>
    );
  }

  let wrapper: ReactWrapper;

  beforeEach(() => { wrapper = mount(<Wrapper />); });
  afterEach(() => { wrapper.unmount(); });

  describe('with no modals', () => {
    it('renders no modals', () => {
      expect(wrapper.find('.test-backdrop-class-name').length).to.eq(0);
    });
  });

  describe('with a modal', () => {
    beforeEach(() => {
      wrapper.setProps({showModal: true});
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
      const backdrop = wrapper.find('.test-modal');

      expect(backdrop.length).to.eq(1);
    });

    describe('that has props change', () => {
      beforeEach(() => {
        wrapper.setProps({showModal: true, modalProps: {message: 'hello'}});
      });

      it('passes down changed props', () => {
        const backdrop = wrapper.find('.test-modal div');
        expect(backdrop.get(0).textContent).to.eq('hello');
      });

    });

    describe('that is subsequently hidden', () => {
      beforeEach(() => {
        wrapper.setProps({showModal: false});
      });

      it('removes backdrop', () => {
        const backdrop = wrapper.find('.test-backdrop-class-name');

        expect(backdrop.length).to.eq(0);
      });

      it('removes modal', () => {
        const backdrop = wrapper.find('.test-backdrop-class-name');

        expect(backdrop.length).to.eq(0);
      });
    });
  });
});
