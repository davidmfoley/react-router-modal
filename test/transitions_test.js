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
  let modal: ReactWrapper;
  let container: ReactWrapper;

  describe('when a modal is shown', () => {
    beforeEach(() => {
      container = mount(
        <ModalContainer
          modalClassName='modal'
          backdropClassName='backdrop'
          outDelay={20}
        />
      );

      modal = mount(
        <div>
          <Modal
            inClassName='modal-in'
            outClassName='modal-out'
            backdropInClassName='backdrop-in'
            backdropOutClassName='backdrop-out'
            component={TestModalContent}
            props={{}}
          />
        </div>
      );
    });

    afterEach(done => {
      modal && modal.unmount();
      modal = null;
      container.unmount();
      setTimeout(done, 25);
    });

    it('has the modal className but not the inClassName', () => {
      expect(container.find('.modal').hasClass('modal-in')).to.eq(false);
    });

    it('backdrop has the backdrop className but not the backdropInClassName', () => {
      expect(container.find('.backdrop').hasClass('backdrop-in')).to.eq(false);
    });

    describe('after initial render', () => {
      beforeEach(done => {
        setTimeout(done, 20);
      });

      it('gets the inClassName', () => {
        expect(container.find('.modal').hasClass('modal-in')).to.eq(true);
      });

      it('backdrop gets the backDropInClassName', () => {
        expect(container.find('.backdrop').hasClass('backdrop-in')).to.eq(true);
      });
    });

    describe('when a modal is unmounted', () => {
      beforeEach(() => {
        modal.unmount();
        modal = null;
      });

      it('has the outClassName', () => {
        expect(container.find('.modal').hasClass('modal-out')).to.eq(true);
      });

      it('backdrop gets the backDropOutClassName', () => {
        expect(container.find('.backdrop').hasClass('backdrop-out')).to.eq(true);
      });

      describe('after out delay', () => {
        beforeEach(done => {
          setTimeout(done, 20);

        });
        it('is removed from dom', () => {
          expect(container.find('.modal').length).to.eq(0);
        });

        it('backdrop is removed from dom', () => {
          expect(container.find('.backdrop').length).to.eq(0);
        });
      });
    });
  });
});
