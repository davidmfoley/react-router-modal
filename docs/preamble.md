A simple way to handle showing modals with react-router version 4.

Component docs: https://github.com/davidmfoley/react-router-modal/blob/master/docs/react-router-modal.md

Examples: https://davidmfoley.github.io/react-router-modal-examples

### Installation

Install using yarn or npm.

`npm install react-router-modal --save`

or

`yarn add react-router-modal`

You will also need to install some other modules as peers.

TBH, if you are looking at this package you probably already have these, but you might want to check for version compatibility.

`react-router-dom` *version 4*

`react` & `react-dom`, version 15 or higher

For ex: `yarn add react-router-dom react react-dom`.

### Getting started

To add react-router-modal to your app:

1. Include the CSS for react-router-modal, found in this package at `css/react-router-modal.css`

If you are using webpack, you can do this:

`import 'react-router-modal/css/react-router-modal.css';`

Note that you can also copy this file or create your own css and specify your own class names.

2. Add a `<ModalContainer />` to your react application. This is where any shown modals are added to the DOM.

See also: https://github.com/davidmfoley/react-router-modal-examples/blob/master/src/App.js#L42

3. Add a `<ModalRoute />` to test your setup:

```javascript
<ModalRoute path='/modal-test' parentPath='/'>
  Hello
</ModalRoute>
```

4. Navigate to /modal-test in your app. You should see a Modal with the contents "Hello".
