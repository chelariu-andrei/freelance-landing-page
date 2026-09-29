var R = window.React;
function jsx(type, props, key) {
  if (key !== undefined) props = Object.assign({}, props, { key: key });
  return R.createElement(type, props);
}
module.exports = { Fragment: R.Fragment, jsx: jsx, jsxs: jsx, jsxDEV: jsx };
