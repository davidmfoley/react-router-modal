const { JSDOM } = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;
var enzyme = require('enzyme');
var Adapter = require('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter() });

global.requestAnimationFrame = window.requestAnimationFrame = fn => {
  setTimeout(fn, 0);
};

global.scroll = window.scroll = () => {};

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js'
};
copyProps(window, global);

// needs to be after the setup of globals
// otherwise react decides the env doesn't support rendering
// const chai = require('chai');
//const chaiEnzyme = require('chai-enzyme');

//chai.use(chaiEnzyme);
