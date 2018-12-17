import axios from "axios";

import config from "../config";
import ApiError from "../errors/ApiError";
import NetworkError from "../errors/NetworkError";

/**
 * Create axios client
 */
const client = axios.create({
  baseURL: config.apiUrl,
  timeout: config.apiTimeout
});

/**
 * Add API required parameters to request
 */
client.interceptors.request.use(request => {
  /**
   * Extend params with defaults
   */
  request.params = Object.assign({}, request.params, config.apiDefaultQuery);

  /**
   * Create empty object if there is no params
   */
  if (typeof request.params === "undefined") {
    request.params = {};
  }

  /**
   * Attach api key to params
   */
  request.params.api_key = config.apiKey;

  return request;
});

/**
 * Format response to our needs
 */
client.interceptors.response.use(
  function(response) {
    if (response.status !== 200) {
      throw new ApiError(
        `The HTTP response status from flickr service is not 200. HTTP response status: ${response.status}`
      );
    }

    if (!response.headers.hasOwnProperty("content-type") || response.headers["content-type"] !== "application/json") {
      throw new ApiError(`The response from flickr service is not in application/json format.`);
    }

    if (response.data.stat !== "ok") {
      throw new ApiError(
        `The response stat from flickr service is not "ok". Error message from flickr. Response code: ${
          response.data.code
        }. Response message: ${response.data.message}.`
      );
    }

    // Do something with response data
    return response.data;
  },
  function() {
    /**
     * The request was made but no response was received. `error.request`
     * is an instance of XMLHttpRequest in the browser and an instance of
     * http.ClientRequest in node.js
     */
    throw new NetworkError(`Failed to fetch resources.`);
  }
);

export default client;
