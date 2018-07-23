if (typeof window !== 'undefined') {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = fn => setTimeout(fn, 0);
  }
}
