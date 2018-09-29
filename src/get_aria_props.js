// @flow

const getAriaProps = (props: Object) => {
  const ariaProps = {};
  const keys = Object.keys(props).filter(p => p.indexOf('aria-') === 0 || p === 'role');
  keys.forEach(p => {
    ariaProps[p] = props[p];
  });

  return ariaProps;
}

export default getAriaProps;
