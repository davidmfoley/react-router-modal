// @flow
import React from 'react';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { mount, ReactWrapper } from 'enzyme';
import ModalLink from '../src/modal_link';
import ModalContainer from '../src/modal_container';
import { MemoryRouter } from 'react-router-dom';
import chai from 'chai';

let expect = chai.expect;

function FooModal() {
  return <div>FOO</div>;
}


describe('ModalLink', () => {
  let wrapper: ReactWrapper;
  afterEach(() => { wrapper.unmount(); });

  describe('when routes do not match', () => {
    beforeEach(() => {
      wrapper = mount(
        <MemoryRouter>
          <div>
            <ModalContainer backdropClassName='test-backdrop'/>
            <ModalLink component={FooModal} path='/foo' modalClassName='test-modal test-modal-foo' linkClassName='test-link-foo'/>
          </div>
        </MemoryRouter>
      );
    });

    it('renders links', () => {
      expect(wrapper.find('a.test-link-foo').length).to.eq(1);
      expect(wrapper.find('.test-link-foo').at(0).props().to).to.eq('/foo');
    });
  });


  describe('when route matches', () => {
    beforeEach(() => {
      wrapper = mount(
        <MemoryRouter initialEntries = {['/foo']}>
          <div>
            <ModalContainer backdropClassName='test-backdrop'/>
            <ModalLink component={FooModal} path='/foo' modalClassName='test-modal test-modal-foo' linkClassName='test-link-foo' aria-label='Aria Label'/>
          </div>
        </MemoryRouter>
      );
    });


    it('renders the modal', () => {
      expect(wrapper.find('div.test-modal-foo').length).to.eq(1);
      expect(wrapper.find('div.test-modal-foo').props()['aria-label']).to.eq('Aria Label');
    });
  });
});
