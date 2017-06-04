// @flow
import React from 'react';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { mount, ReactWrapper } from 'enzyme';
import Modal from '../src/modal';
import ModalRoute from '../src/modal_route';
import ModalContainer from '../src/modal_container';
import { withRouter, MemoryRouter } from 'react-router-dom';
import chai from 'chai';

let expect = chai.expect;

function FooModal() {
  return <div>FOO</div>;
}

function BarModal() {
  return <div>BAR</div>;
}

function BazModal() {
  return <div>BAR</div>;
}

function Wrapper({showModal, match}) {
  return (
    <div>
      <ModalContainer backdropClassName='test-backdrop'/>
      <ModalRoute component={FooModal} path='*/foo' className='test-modal test-modal-foo'/>
      <ModalRoute component={BarModal} path='*/bar' className='test-modal test-modal-bar'/>
    </div>
  );
}

const RouterWrapper = withRouter(Wrapper);

describe('ModalRoute', () => {
  let wrapper: ReactWrapper;

  afterEach(() => { wrapper.unmount(); });

  describe('when no routes match', () => {

    beforeEach(() => {
      wrapper = mount(
        <MemoryRouter>
          <RouterWrapper />
        </MemoryRouter>
      );
    });

    it('renders no modals', () => {
      expect(wrapper.find('.test-backdrop').length).to.eq(0);
    });
  });

  describe('with a matching route', () => {
    beforeEach(() => {
      wrapper = mount(
        <MemoryRouter initialEntries = {['/foo']}>
          <RouterWrapper />
        </MemoryRouter>
      );
    });

    it('renders the modal', () => {
      expect(wrapper.find('.test-modal-foo').length).to.eq(1);
    });
  });

  describe('with two matching routes', () => {
    beforeEach(() => {
      wrapper = mount(
        <MemoryRouter initialEntries = {['/foo/bar']}>
          <RouterWrapper />
        </MemoryRouter>
      );
    });

    it('renders two modals', () => {
      expect(wrapper.find('.test-modal-foo').length).to.eq(1);
      expect(wrapper.find('.test-modal-bar').length).to.eq(1);
    });

    it('renders modals in order by matched path length', () => {
      const modalWrappers = wrapper.find('.test-modal');
      expect(modalWrappers.get(0).className).to.eq('test-modal test-modal-foo');
      expect(modalWrappers.get(1).className).to.eq('test-modal test-modal-bar');
    });
  });

  describe('when route is reversed', () => {
    beforeEach(() => {
      wrapper = mount(
        <MemoryRouter initialEntries = {['/bar/foo']}>
          <RouterWrapper />
        </MemoryRouter>
      );
    });

    it('renders two modals', () => {
      expect(wrapper.find('.test-modal-foo').length).to.eq(1);
      expect(wrapper.find('.test-modal-bar').length).to.eq(1);
    });

    it('renders modals in order by matched path length', () => {
      const modalWrappers = wrapper.find('.test-modal');
      expect(modalWrappers.get(0).className).to.eq('test-modal test-modal-bar');
      expect(modalWrappers.get(1).className).to.eq('test-modal test-modal-foo');
    });
  });

  describe('with Modal and ModalRoute', () => {
    beforeEach(() => {
      wrapper = mount(
        <MemoryRouter initialEntries = {['/bar/foo']}>
          <div>
            <Modal component={BazModal} className='test-modal test-modal-baz-1'/>
            <Modal component={BazModal} className='test-modal test-modal-baz-2'/>
            <RouterWrapper />
          </div>
        </MemoryRouter>
      );
    });

    it('renders route modals first, then others', () => {
      const modalWrappers = wrapper.find('.test-modal');
      expect(modalWrappers.get(0).className).to.eq('test-modal test-modal-bar');
      expect(modalWrappers.get(1).className).to.eq('test-modal test-modal-foo');
      expect(modalWrappers.get(2).className).to.eq('test-modal test-modal-baz-1');
      expect(modalWrappers.get(3).className).to.eq('test-modal test-modal-baz-2');
    });
  });
});
