/**
 *
 * @param {string} string
 * @param {string} ch
 * @returns {string}
 */

export function trimStart(string, ch = ' ') {
  let res = string.substring(0)
  while (res.startsWith(ch) && res.length > 0) {
    res = res.slice(1)
  }

  return res
}
