// @flow
import React from 'react';
import { describe, it, afterEach } from 'mocha';
import { mount } from 'enzyme';
import ModalContainer from '../src/modal_container';
import Modal from '../src/modal';
import chai from 'chai';

let expect = chai.expect;

describe('modal accessibility', () => {
  let content: any;

  afterEach(() => {
    content.unmount();
  });

  it('always has aria-modal and dialog role', () => {
    content = mount(
      <Wrapper>
        <Modal
          className='test-modal'
        >
          <h3 id="modal-label">Example label</h3>
          <p id="modal-description">Example description</p>
        </Modal>

      </Wrapper>
    );

    const modal = content.find('.test-modal');

    expect(modal.props().role).to.eq('dialog');
    expect(modal.props()['aria-modal']).to.eq(true);

    content.unmount();
  });

  it('supports basic aria props', () => {
    content = mount(
      <Wrapper>
        <Modal
          className='test-modal'
          aria-labelled-by="modal-label"
          aria-described-by="modal-description"
        >
          <h3 id="modal-label">Example label</h3>
          <p id="modal-description">Example description</p>
        </Modal>

      </Wrapper>
    );

    const modal = content.find('.test-modal');

    expect(modal.props().role).to.eq('dialog');
    expect(modal.props()['aria-modal']).to.eq(true);
    expect(modal.props()['aria-labelled-by']).to.eq('modal-label');
    expect(modal.props()['aria-described-by']).to.eq('modal-description');

    content.unmount();
  });

  it('can override role', () => {
    content = mount(
      <Wrapper>
        <Modal
          className='test-modal'
          role='alertdialog'
          aria-labelled-by="modal-label"
          aria-described-by="modal-description"
        >
          <h3 id="modal-label">Example label</h3>
          <p id="modal-description">Example description</p>
        </Modal>
      </Wrapper>
    );

    const modal = content.find('.test-modal');

    expect(modal.props().role).to.eq('alertdialog');
    expect(modal.props()['aria-modal']).to.eq(true);
    expect(modal.props()['aria-labelled-by']).to.eq('modal-label');
    expect(modal.props()['aria-described-by']).to.eq('modal-description');

    content.unmount();
  });

  function Wrapper({children}: any) {
    return (
      <div>
        {children}
        <ModalContainer backdropClassName='test-backdrop-class-name' wrapperClassName='test-wrapper-class-name'/>
      </div>
    );
  }
});
