import notie from "notie";
import "notie/dist/notie.css";

import NetworkError from "../../errors/NetworkError";

import errorHtml from "../../assets/template/error.html";

/**
 * Global error handler.
 *
 * @returns {void} Returns nothing.
 */
export function error() {
  handle("An error occurred!");
}

/**
 * Global promise rejection handler.
 *
 * @param {Object} error - Promise rejection event.
 *
 * @returns {void} Returns nothing.
 */
export function promise(error) {
  handle("An error occurred! Promise rejection.", error.reason);
}

/**
 * Vue error handler.
 *
 * @param {Error} error - Error object.
 * @param {Object} vm - Vue object.
 * @param {string} info - Error information.
 *
 * @returns {void} Returns nothing.
 */
export function vueError(error, vm, info) {
  handle("An Vue error occurred! " + info, error);
}

/**
 * Vue error handler.
 *
 * @param {Error} error - Error object.
 * @param {Object} vm - Vue object.
 * @param {string} info - Error information.
 *
 * @returns {void} Returns nothing.
 */
export function vueWarn(error, vm, info) {
  handle("An Vue warning occurred!" + info, error);
}

/**
 * Single function to handler errors.
 *
 * @param {string} title - Error title.
 * @param {Error} error - Error object.
 *
 * @returns {void} Returns nothing.
 */
function handle(title, error) {
  if (process.env.NODE_ENV === "development") {
    notification();

    console.error(title);

    if (typeof error !== "undefined") {
      console.error(error);
    }
  }

  if (typeof error !== "undefined" && error.constructor === NetworkError) {
    return;
  }

  if (process.env.NODE_ENV === "production") {
    window.document.body.innerHTML = errorHtml;
    window.document.getElementById("error").innerHTML = new Date().getTime();
  }
}

/**
 * Show notification about error.
 *
 * @returns {void} Returns nothing.
 */
function notification() {
  notie.alert({
    type: "error",
    text: "An error occurred! Check browser console!",
    position: "bottom"
  });
}
