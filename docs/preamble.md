A simple way to handle showing modals with react-router version 4.

Component docs: https://github.com/davidmfoley/react-router-modal/blob/master/docs/react-router-modal.md

Examples: https://davidmfoley.github.io/react-router-modal-examples

# Which version of react-router-modal should I use?

TL;DR: If you are using a version of react that is >= 16.3, you should use version 2.

- react-router-modal version 1 works with react 15.0 and higher
- react-router-modal version 2 works *only* with react 16.3 and higher

Version 2 uses react portals. This makes a few things nicer.

The most notable difference is that context that is provided outside of modals works properly within modals.

You can use `yarn info react version` or `npm info react version`, within your project directory, to find the version of react.

Because portals are not available on many widely used versions of react, version 2 is currently pre-release.

Install version 1:

`yarn add react-router-modal`

or

`npm install --save react-router-modal`

### Install version 2:

`yarn add react-router-modal@next`

or

`npm install --save react-router-modal@next`

### Other required modules

You also need `react-router-dom`, version 4 or higher.

TBH, if you are looking at this package you probably already have these, but you might want to check for version compatibility.

`react-router-dom` *version 4*

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

### Gotchas

#### My modals are not showing at all

1. Did you render a ModalContainer?

2. Did you include the CSS to style the modals and their backdrops?

#### I see my modal content but the component "behind" it is not rendering.

To display a modal component "on top" of another component, *both* routes (the ModalRoute and the Route that renders the other component) must match.

If you are seeing modal content but the component that you expect to see "behind" the modal is not rendering, you should check for the following:

1. Did you put both routes inside a `<Switch />`, so only one of them matches?

2. Did you use `exact` on the `<Route />` that contains the component that is meant to render "under" the modal?

