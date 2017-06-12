### TL;DR Example

```javascript
import { ModalContainer, ModalRoute } from 'react-router-modal';
import { BrowserRouter, Link } from 'react-router-dom';

// assumes webpack loader for css
// ... or include this css however you do that in your project ...
import 'react-router-modal/css/react-router-modal.css'

function FooModal() {
  return <div>FOO</div>;
}

function BarModal() {
  return <div>BAR</div>;
}

function Example() {
 return (
   <BrowserRouter>
     <div>
       <Link to='/foo'>show foo</Link>
       <Link to='/bar'>show bar</Link>

       <ModalRoute component={FooModal} path='/foo' className='test-modal test-modal-foo'/>
       <ModalRoute component={BarModal} path='/bar' className='test-modal test-modal-bar'/>

       <ModalContainer />
     </div>
   </BrowserRouter>
 );
}
```
