// @flow
import { describe, it, afterEach, beforeEach } from 'mocha';

import {
  mountModal,
  unmountModal,
  setModalSetIdsHandler,
  setModalSetHandler,
  resetAll,
  setDefaultOutDelay,
  containerCreated
} from '../src/modal_controller';

import { expect } from 'chai';

describe('ModalController', () => {
  let lastSetIds;
  let setHandlerCallCount;

  beforeEach(() => {
    setHandlerCallCount = 0;
    setModalSetIdsHandler(setIds => {
      lastSetIds = setIds;
      setHandlerCallCount++;
    });
  });

  afterEach(resetAll);

  it('initially notifies with no sets', () => {
    expect(setHandlerCallCount).to.eql(1);
    expect(lastSetIds).to.eql([]);
  });

  describe('after mounting a modal', () => {
    let outerModalId;
    beforeEach(() => {
      outerModalId = mountModal({
      });
    });

    it('notifies with zero set', () => {
      expect(setHandlerCallCount).to.eql(2);
      expect(lastSetIds).to.eql([0]);
      expect(outerModalId).to.be.gt(0);
    });

    it('is passed to handler upon mount', done => {
      setModalSetHandler(0, modals => {
        expect(modals.length).to.eq(1);
        expect(modals[0].id).to.eq(outerModalId);
        expect(modals[0].info.setId).to.eq(0);
        done();
      });
    });

    it('notifies with no sets after unmount', () => {
      unmountModal(outerModalId);
      expect(lastSetIds).to.eql([]);
    });

    describe('then mounting a modal under it', () => {
      it('is passed to a handler registered after', done => {
        const innerModalId = mountModal({
          setId: outerModalId
        });

        setModalSetHandler(outerModalId, modals => {
          expect(modals.length).to.eq(1);
          expect(modals[0].id).to.eq(innerModalId);
          expect(modals[0].info.setId).to.eq(outerModalId);
          done();
        });
      });

      it('is passed to a handler registered before', done => {
        let callCount = 0;

        setModalSetHandler(outerModalId, modals => {
          callCount++;
          if (callCount === 1) {
            expect(modals.length).to.eq(0);
          }
          else {
            expect(modals.length).to.eq(1);
            expect(modals[0].info.setId).to.eq(outerModalId);
            done();
          }
        });

        mountModal({
          setId: outerModalId
        });
      });

      it('updates only the first set', done => {
        const innerModalId = mountModal({
          setId: outerModalId
        });

        setModalSetHandler(outerModalId, modals => {
          expect(modals.length).to.eq(1);
          expect(modals[0].id).to.eq(innerModalId);
          expect(modals[0].info.setId).to.eq(outerModalId);
          done();
        });
      });
    });
  });

  describe('unmounting a modal with defaultOutDelay', () => {
    it('unmounts after a delay', done => {
      setDefaultOutDelay(10);

      const modalId = mountModal({
        setId: 0,
        outDelay: undefined
      });

      let calls = 0;
      setModalSetHandler(0, modals => {
        calls++;
        if (calls === 1) {
          expect(modals.length).to.eq(1);
          expect(!!modals[0].info.out).to.eq(false);
        }
        if (calls === 2) {
          expect(modals.length).to.eq(1);
          expect(modals[0].info.out).to.eq(true);
        }
        if (calls === 3) {
          expect(modals).to.eql([]);
          done();
        }
      });

      unmountModal(modalId);
    })
  });

  describe('unmounting a modal with outDelay', () => {
    let modalId;
    const innerHTML = 'foo';

    beforeEach(() => {
      setDefaultOutDelay(0);

      modalId = mountModal({
        onPortalDestination: () => {},
        outDelay: 10,
        setId: 0
      });

      containerCreated(modalId, { innerHTML });
    });

    it('unmounts after a delay', done => {

      let calls = 0;

      setModalSetHandler(0, modals => {
        calls++;
        if (calls === 1) {
          expect(modals.length).to.eq(1);
          expect(!!modals[0].info.out).to.eq(false);
        }
        if (calls === 2) {
          expect(modals.length).to.eq(1);
          expect(modals[0].info.out).to.eq(true);
          expect(modals[0].info.frozenContent).to.eq(innerHTML);
        }
        if (calls === 3) {
          expect(modals).to.eql([]);
          done();
        }
      });

      unmountModal(modalId);
    })

    it('resolves the promise after the delay', () => {
      const promise = unmountModal(modalId);

      expect(promise).to.be.an.instanceOf(Promise);
      return promise;
    })
  });
});
