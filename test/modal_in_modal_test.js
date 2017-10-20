// @flow
import React from 'react';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { mount, ReactWrapper } from 'enzyme';
import ModalContainer from '../src/modal_container';
import Modal from '../src/modal';
import chai from 'chai';

let expect = chai.expect;

function Inner() {
  return (
    <div>Inner!</div>
  );
}

function OuterWithComponent({showInner}: any): any {
  return (
    <div>
      { showInner && (
        <Modal className='test-modal-inner' component={Inner} />
      )}
    </div>
  );
}

function OuterWithChildren({showInner}: any): any {
  return (
    <div>
      { showInner && (
        <Modal className='test-modal-inner' >
          <Inner />
        </Modal>
      )}
    </div>
  );
}

describe('rendering nested modals', () => {
  describe('with outer component and inner children', () => {
    let wrapper: ReactWrapper;

    function WrapperWithComponentWithChildren({showOuter, showInner}: any) {
      return (
        <div>
          { showOuter && (
            <Modal className='test-modal-outer' component={OuterWithChildren} props={{showInner}} />
          )}
          <ModalContainer backdropClassName='test-backdrop-class-name' />
        </div>
      );
    }

    beforeEach(() => {
      wrapper = mount(<WrapperWithComponentWithChildren />);
      wrapper.setProps({showOuter: true});

      try {
        wrapper.setProps({showInner: true});
      }
      catch(e) {
        // don't want to see the entire stack trace if this breaks
        throw new Error(e.message);
      }
    });

    afterEach(() => { wrapper.unmount(); });

    it('renders both modals', () => {
      const backdrop = wrapper.find('.test-backdrop-class-name');

      expect(backdrop.length).to.eq(2);
    });
  });

  describe('with outer component and inner children', () => {
    let wrapper: ReactWrapper;

    function WrapperWithComponents({showOuter, showInner}: any) {
      return (
        <div>
          { showOuter && (
            <Modal className='test-modal-outer' component={OuterWithComponent} props={{showInner}} />
          )}
          <ModalContainer backdropClassName='test-backdrop-class-name' />
        </div>
      );
    }

    beforeEach(() => {
      try {
        wrapper = mount(<WrapperWithComponents />);
        wrapper.setProps({showOuter: true, showInner: true});
      }
      catch(e) {
        // don't want to see the entire stack trace if this breaks
        throw new Error(e.message);
      }
    });

    afterEach(() => { wrapper && wrapper.unmount(); });

    it('renders both modals', () => {
      const backdrop = wrapper.find('.test-backdrop-class-name');

      expect(backdrop.length).to.eq(2);
    });
  });

  describe('mounted all at once', () => {
    let wrapper: ReactWrapper;

    function WrapperWithComponentWithChildren() {
      return (
        <div>
          <Modal>
            <Modal>HI</Modal>
          </Modal>
          <ModalContainer backdropClassName='test-backdrop-class-name' />
        </div>
      );
    }

    beforeEach(() => {
      try {
        wrapper = mount(<WrapperWithComponentWithChildren />);
      }
      catch(e) {
        // don't want to see the entire stack trace if this breaks
        throw new Error(e.message);
      }
    });

    afterEach(() => { wrapper && wrapper.unmount(); });

    it('renders both modals', () => {
      const backdrop = wrapper.find('.test-backdrop-class-name');

      expect(backdrop.length).to.eq(2);
    });
  });
});
