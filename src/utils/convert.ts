
export const objToString = (obj: Object) => {
  return Object.entries(obj).reduce((str, [p, val]) => {
    return `${str}${p}:${val} `;
  }, '');
}