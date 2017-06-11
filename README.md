## react-router-modal

A simple way to handle showing modals with react-router version 4.

Examples: https://davidmfoley.github.io/react-router-modal-examples

Component docs: https://github.com/davidmfoley/react-router-modal/docs/react-router-modal.md

### Installation

Install using yarn or npm.

`npm install react-router-modal --save`

`yarn add react-router-modal`

You will also need to install some other modules as peers.
TBH, if you are looking at this package you probably already have these, but you might want to check for version compaibility.

`react-router-dom` *version 4*

`react` & `react-dom`, version 15

For ex: `yarn add react-router-dom react react-dom`.

### Components

#### ModalContainer

ModalContainer contains all modals that are shown. Typically you will want to mount this just before your closing `</body>` tag.
Nothing will be rendered into the dom if no modals are currently shown.

```
  <ModalContainer
    bodyModalOpenClassName='modal-open'
    containerClassName='modal-container'
    backdropClassName='modal-backdrop'
    modalClassName='modal'
  />
```

##### props

###### `bodyModalOpenClassName`

Class name to set on the `<body>` when a modal is mounted. Typically used to prevent default scroll behavior, etc.
Defaults to `react-router-modal__modal-open`

###### `containerClassName`
Class name for the modal container element. Note that this element is only rendered when at least one modal is shown.

Defaults to `react-router-modal__modal-container`

###### `backdropClassName`
Class name for the modal backdrop element(s) that are show behind each modal.
Defaults to `react-router-modal__modal-backdrop`

###### `modalClassName`
Class name for the modal element(s) that wrap the modal content. Can be overridden by the `className` property on `<ModalRoute />` or `<Modal />`

Defaults to `react-router-modal__modal`

#### ModalRoute

ModalRoute attaches a component to a route in react-router (version 4). When the route is matched, the component is rendered in a modal element.

```
  <ModalRoute
    className='image-detail-modal'
    component={MyImageDetailComponent}
    props={ { foo: 'bar'} }
    path='*/images/:imageId'
  />
```
##### props

###### path

The path to match. See react-router docs.

###### component

The component to render inside the modal when the path is matched.

###### exact

Only match on exact route match. See react-router docs.

###### props

Properties to be passed to the component when the route is matched.
The react-router props `location', 'history', and 'match` will also be included.

###### className

If set, overrides the `modalClassName` property on the `ModalContainer`

When the route matches, the component will be shown inside a modal.
If multiple routes match, the modals will be stacked based on the length of the path that is matched.

#### ModalLink

ModalLink provides a simple way to create a ModalRoute and a Link at the same time.

##### props

###### path

The path to match.

###### component

The component to render inside the modal when the path is matched.
Note that children are rendered in the Link, not in the modal as with other components.

###### exact

Only match on exact route match. See react-router docs.

###### props

Properties to be passed to the component when the route is matched.
The react-router props `location', 'history', and 'match` will also be included.

###### linkClassName

className for the Link.

###### modalClassName

className for the Modal.

#### Modal

If you want to show a modal without a route, you can use this. Modals shown this way default to stacking on top of modals shown with ModalRoute.


```
<div>
  <Modal
    className='top-component-modal'
    component={MyTopComponent}
    props={ { foo: 'bar'} }
    stackOrder={2}
  />
  <Modal
    component={MyBottomComponent}
    props={ { bar: 'baz'} }
    stackOrder={1}
  />
</div>
```
##### props

###### component

The component to render inside the modal when the path is matched.

###### props

Properties to be passed to the component rendered inside the modal.

###### stackOrder

Controls the order the modals are stacked. Higher number means "on top".
If not set, modals will default to stacking in the order they are mounted.

###### className

className used on the modal. Defaults to the `modalClassName` property on the `ModalContainer`

### CSS

Default css is included in `css/react-router-modal.css`. You can use this as a basis for your own modal styles.

#### Example functional component
```
import { ModalContainer, ModalRoute, Modal } from 'react-router-modal';
import { BrowserRouter, Link } from 'react-router-dom';

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
        <Link to='/foo/bar'>Bar on top of Foo</Link>
        <Link to='/bar/foo'>Foo on top of Bar</Link>

        <Link to='/foo'>just foo</Link>
        <Link to='/bar'>just bar</Link>

        <ModalRoute component={FooModal} path='*/foo' className='test-modal test-modal-foo'/>
        <ModalRoute component={BarModal} path='*/bar' className='test-modal test-modal-bar'/>

        <ModalContainer />
      </div>
    </BrowserRouter>
  );
}
```
