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


describe('ModalRoute', () => {
  let wrapper: ReactWrapper;
  let barProps: Object;
  let fooProps: Object;

  function FooModal(props) {
    fooProps = props;
    return <div>FOO</div>;
  }

  function BarModal(props) {
    barProps = props;
    return <div>BAR</div>;
  }

  function BazModal() {
    return <div>BAR</div>;
  }

  function Wrapper() {
    return (
      <div>
        <ModalContainer backdropClassName='test-backdrop'/>
        <ModalRoute component={FooModal} path='*/foo' className='test-modal test-modal-foo' />
        <ModalRoute component={BarModal} path='*/bar' className='test-modal test-modal-bar'/>
      </div>
    );
  }


  const RouterWrapper = withRouter(Wrapper);

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

  describe('passing down props', () => {
    const PropsTestWrapper = props => (
      <MemoryRouter initialEntries={['/foo']}>
        <div>
          <ModalRoute component={FooModal} path='*/foo' className='test-modal test-modal-foo' props={props} />
          <ModalContainer backdropClassName='test-backdrop' />
        </div>
      </MemoryRouter>
    );

    beforeEach(() => {
      wrapper = mount(
        <PropsTestWrapper foo='bar' />
      );
    });

    it('passes down props.props', () => {
      const foo = wrapper.find(FooModal);
      expect(foo.props().foo).to.eq('bar');
      expect(wrapper.find('.test-modal-foo').length).to.eq(1);
    });

    it('passes down changes to props.props', () => {
      wrapper.setProps({ foo: 'baz' })
      const foo = wrapper.find(FooModal);
      expect(foo.props().foo).to.eq('baz');
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

    it('injects parentPath prop into rendered component', () => {
      expect(fooProps.parentPath).to.eq('/');
      expect(barProps.parentPath).to.eq('/foo');
    });

    it('renders modals in order by matched path length', () => {
      const modalWrappers = wrapper.find('.test-modal');
      expect(modalWrappers.get(0).className).to.eq('test-modal test-modal-foo');
      expect(modalWrappers.get(1).className).to.eq('test-modal test-modal-bar');
    });
  });

  describe('onBackdropClick', () => {
    let handlerInvoked;
    const onBackdropClick = () => handlerInvoked = true;
    beforeEach(() => {
      handlerInvoked = false;

      wrapper = mount(
        <MemoryRouter initialEntries = {['/foo/bar']}>
          <div>
            <ModalRoute component={BarModal} path='*/bar' className='test-string' parentPath='/foo' onBackdropClick={onBackdropClick} />
            <ModalContainer backdropClassName='test-backdrop'/>
          </div>
        </MemoryRouter>
      );
    });

    it('invokes the custom handler when backdrop is clicked', () => {
      expect(wrapper.find('.test-string').length).to.eq(1);

      const backdrop = wrapper.find('.test-backdrop');
      backdrop.simulate('click');

      expect(handlerInvoked).to.eq(true);
    });

    it('does not invoke the handler until the click', () => {
      expect(handlerInvoked).to.eq(false);
    });
  });

  describe('parentPath', () => {
    describe('as string', () => {
      beforeEach(() => {
        wrapper = mount(
          <MemoryRouter initialEntries = {['/foo/bar']}>
            <div>
              <ModalRoute component={BarModal} path='*/bar' className='test-string' parentPath='/foo'/>
              <ModalContainer backdropClassName='test-backdrop'/>
            </div>
          </MemoryRouter>
        );
      });

      it('navigates to parent path on backdrop click', () => {
        expect(wrapper.find('.test-string').length).to.eq(1);

        const backdrop = wrapper.find('.test-backdrop');
        backdrop.simulate('click');

        expect(wrapper.find('.test-string').length).to.eq(0);
      });
    });

    describe('as function', () => {
      function testParentPathHandler() {
        return '/foo';
      }

      beforeEach(() => {
        wrapper = mount(
          <MemoryRouter initialEntries = {['/foo/bar']}>
            <div>
              <ModalRoute component={BarModal} path='*/bar' className='test-string' parentPath={testParentPathHandler}/>
              <ModalContainer backdropClassName='test-backdrop'/>
            </div>
          </MemoryRouter>
        );
      });

      it('navigates to parent path on backdrop click', () => {
        expect(wrapper.find('.test-string').length).to.eq(1);

        const backdrop = wrapper.find('.test-backdrop');
        backdrop.simulate('click');

        expect(wrapper.find('.test-string').length).to.eq(0);
      });
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

  describe('with param in route path', () => {
    beforeEach(() => {
      const MessageModal = ({match}: any) => (<p>{match.params.message}</p>);
      wrapper = mount(
        <MemoryRouter initialEntries = {['/message/hello']}>
          <div>
            <ModalContainer backdropClassName='test-backdrop'/>
            <ModalRoute component={MessageModal} path='*/message/:message' className='test-modal'/>
          </div>
        </MemoryRouter>
      );
    });

    it('passes along the route params', () => {
      expect(wrapper.find('.test-modal').length).to.eq(1);
      expect(wrapper.find('.test-modal p').get(0).textContent).to.eq('hello');
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
