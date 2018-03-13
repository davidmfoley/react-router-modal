// @flow
import React from 'react';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { mount, ReactWrapper } from 'enzyme';
import Modal from '../src/modal';
import ModalContainer from '../src/modal_container';
import chai from 'chai';

let expect = chai.expect;

function TestModalContent() {
  return <div />
}

describe('ModalContainer lifecycle', () => {
  let wrapper: ReactWrapper;
  let firstModalMountedCalls = 0;
  let lastModalUnmountedCalls = 0;
  let onFirstModalMounted = () => firstModalMountedCalls++;
  let onLastModalUnmounted = () => lastModalUnmountedCalls++
  let oldWindowScroll;
  let scrolledTo: ?Object;

  function Wrapper({showModal}: any) {
    return (
      <div>
        { showModal && <Modal className='test-modal' component={TestModalContent} props={{}} /> }
        <ModalContainer onFirstModalMounted={onFirstModalMounted} onLastModalUnmounted={onLastModalUnmounted}/>
      </div>
    );
  }


  beforeEach(() => {
    oldWindowScroll = window.scroll;
    window.scroll = (x, y) => {
      scrolledTo = {x, y};
    }
    window.requestAnimationFrame = fn => fn();
    scrolledTo = null;
    firstModalMountedCalls = 0;
    lastModalUnmountedCalls = 0;
  });

  afterEach(() => {
    window.requestAnimationFrame = undefined;
    wrapper.unmount();
    window.scroll = oldWindowScroll;
  });

  describe('when container is rendered', () => {
    beforeEach(() => {
      wrapper = mount(
        <Wrapper />
      );
    });

    it('has not yet invoked lifecycle handlers', () => {
      expect(firstModalMountedCalls).to.eq(0);
      expect(lastModalUnmountedCalls).to.eq(0);
    });

    describe('after a modal is mounted', () => {
      beforeEach(() => {
        wrapper.setProps({showModal: true});
      });

      it('invokes first modal show handler', () => {
        expect(firstModalMountedCalls).to.eq(1);
        expect(lastModalUnmountedCalls).to.eq(0);
      });

      it('does not scroll', () => {
        expect(scrolledTo).to.eq(null);
      });

      describe('and then unmounted', () => {
        beforeEach(() => {
          wrapper.setProps({showModal: false});
        });

        it('invokes last modal unmount handler', () => {
          expect(firstModalMountedCalls).to.eq(1);
          expect(lastModalUnmountedCalls).to.eq(1);
        });

        it('scrolls to original position', () => {
          expect(scrolledTo).to.eql({x:0, y:0});
        });
      });
    });
  });
});
