import Modal from './modal';
import ModalContainer from './modal_container';
import ModalLink from './modal_link';
import ModalRoute from './modal_route';

/**
* @example <caption>TL;DR</caption>
*import { ModalContainer, ModalRoute } from 'react-router-modal';
*import { BrowserRouter, Link } from 'react-router-dom';
*
*function FooModal() {
*  return <div>FOO</div>;
*}
*
*function BarModal() {
*  return <div>BAR</div>;
*}
*
*function Example() {
* return (
*   <BrowserRouter>
*     <div>
*       <Link to='/foo'>show foo</Link>
*       <Link to='/bar'>show bar</Link>
*
*       <ModalRoute component={FooModal} path='/foo' className='test-modal test-modal-foo'/>
*       <ModalRoute component={BarModal} path='/bar' className='test-modal test-modal-bar'/>
*
*       <ModalContainer />
*     </div>
*   </BrowserRouter>
* );
*}
*/
export default {Modal, ModalContainer, ModalLink, ModalRoute};

