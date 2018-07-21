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

describe('transitions', () => {
  let wrapper: ReactWrapper;

  describe('when a modal is shown', () => {
    beforeEach(() => {

      wrapper = mount(
        <div>
          <Modal
            inClassName='modal-in'
            outClassName='modal-out'
            backdropInClassName='backdrop-in'
            backdropOutClassName='backdrop-out'
            outDelay={500}
            component={TestModalContent}
            props={{}}
          />
          <ModalContainer
            modalClassName='modal'
            backdropClassName='backdrop'
          />
        </div>
      );
    });

    afterEach(() => wrapper.unmount());

    it('has the modal className but not the inClassName', () => {
      expect(wrapper.find('.modal').hasClass('modal-in')).to.eq(false);
    });

    it('backdrop has the backdrop className but not the backdropInClassName', () => {
      expect(wrapper.find('.backdrop').hasClass('backdrop-in')).to.eq(false);
    });

    describe('after initial render', () => {
      beforeEach(done => {
        setTimeout(done, 20);
      });

      it('gets the inClassName', () => {
        expect(wrapper.find('.modal').hasClass('modal-in')).to.eq(true);
      });

      it('backdrop gets the backDropInClassName', () => {
        expect(wrapper.find('.backdrop').hasClass('backdrop-in')).to.eq(true);
      });
    });
  });

  describe('when a modal is hidden', () => {
    it('has the outClassName', () => { });
    it('is removed from dom after outDelay', () => { });
  });
});
