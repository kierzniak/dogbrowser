/**
 * Split array to chunks.
 *
 * Split array into smaller chunks about size of "length" paramater.
 *
 * @param {Array} arr    - Array to split.
 * @param {int}   length - Numbers of items which will be in single smaller array.
 *
 * @returns {Array} Returns splited array.
 */
function splitToChunks(arr, length = 10) {
  let i;
  let j;
  let newArr = [];

  for (i = 0, j = arr.length; i < j; i += length) {
    newArr.push(arr.slice(i, i + length));
  }

  return newArr;
}

export { splitToChunks };
