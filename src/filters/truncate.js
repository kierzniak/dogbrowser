/**
 * Truncate filter.
 *
 * @param {string} text - Text to truncate.
 * @param {int}    length - How long text should be to truncate it.
 * @param {int}    suffix - Suffix for the truncated text.tamp to convert.
 *
 * @returns {string} Truncated text.
 */
export default function(text, length, suffix = "...") {
  let node, content;

  node = document.createElement("div");
  node.innerHTML = text;

  content = node.textContent;

  return content.length > length ? content.slice(0, length) + suffix : content;
}
