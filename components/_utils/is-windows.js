export default () => {
  try {
    return !!window;
  } catch {
    return false;
  }
}