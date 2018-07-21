if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = fn => setTimeout(fn, 0);
}
