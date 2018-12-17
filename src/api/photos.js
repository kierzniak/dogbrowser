import { DateTime } from "luxon";
import notie from "notie";

import config from "../config";
import request from "../utils/request";

import NetworkError from "../errors/NetworkError";

/**
 * Photos API
 *
 * Photos api is responsible for fetching and formating photos from Flickr API
 */
export default {
  /**
   * Search photos enpoint.
   *
   * @param {Object} params - Search endpoint params.
   * @param {number} page - Which page to load.
   * @param {number} perPage - How many photos to display.
   *
   * @returns {Promise} Photos promise.
   */
  search: function(params = "", page = 1, perPage = 100) {
    params = formatParams(params);

    params.page = page;
    params.per_page = perPage;

    return request
      .get("/", {
        params: params
      })
      .catch(function(error) {
        /**
         * If given error is NetworkError do not display error page. NetworkErrors
         * are handled by application, instead of error page user will get a nice
         * notitication about problem with fetching photos. This may be helpful when
         * user will be in offline mode.
         */
        if (error.constructor === NetworkError) {
          /**
           * Show nice notification to user that something is wrong
           * probably with network.
           */
          notie.alert({
            type: "error",
            text: "Sorry but we are unable to fetch photos. Please try again later.",
            position: "bottom"
          });
        }

        throw error;
      });
  },

  format: function(photo) {
    let formatted = {
      id: photo.id,
      timestamp: photo.dateupload,
      title: photo.title,
      author: photo.ownername,
      authorId: photo.owner,
      description: photo.description._content,
      url: photo.url_m,
      thumbnail: photo.url_sq,
      width: photo.width_m,
      height: photo.height_m,
      lat: photo.latitude,
      lng: photo.longitude
    };

    // In case photo do not have M size image display original size image
    if (!photo.url_m) {
      formatted.url = photo.url_o;
      formatted.width = photo.width_o;
      formatted.height = photo.height_o;
    }

    return formatted;
  },

  formatCollection: function(photos) {
    if (typeof photos === "undefined") {
      return [];
    }

    let formattedCollection = [];

    photos = photos.photos.photo;

    for (let key in photos) {
      formattedCollection.push(this.format(photos[key]));
    }

    return formattedCollection;
  }
};

/**
 * Format params for Flickr API.
 *
 * @param {Object} params - Object of not formatted params.
 *
 * @returns {Object} Formatted params.
 */
function formatParams(params) {
  // Always get fresh clone of defaults
  let formattedQuery = Object.assign({}, config.apiDefaultSearchQuery);

  formattedQuery = Object.assign(formattedQuery, formatQueryParam(params));
  formattedQuery = Object.assign(formattedQuery, formatAuthorParam(params));
  formattedQuery = Object.assign(formattedQuery, formatGeolocationParams(params));
  formattedQuery = Object.assign(formattedQuery, formatLicenseParam(params));
  formattedQuery = Object.assign(formattedQuery, formatColorParam(params));
  formattedQuery = Object.assign(formattedQuery, formatDateParams(params));

  return formattedQuery;
}

/**
 * Format query param for Flickr API.
 *
 * @param {Object} params - Object of not formatted params.
 *
 * @returns {Object} Formatted params.
 */
function formatQueryParam(params) {
  let defaultQuery = typeof config.apiDefaultSearchQuery.text !== "undefined" ? config.apiDefaultSearchQuery.text : "";
  let formatted = {};

  // Add search API param
  if (params.query && params.query.length > 0) {
    formatted.text = encodeURI(defaultQuery) + "+" + encodeURI(params.query);
  }

  return formatted;
}

/**
 * Format author param for Flickr API.
 *
 * @param {Object} params - Object of not formatted params.
 *
 * @returns {Object} Formatted params.
 */
function formatAuthorParam(params) {
  let formatted = {};

  // Add author API param
  if (params.author && params.author.length > 0) {
    formatted.user_id = encodeURI(params.author);
  }

  return formatted;
}

/**
 * Format geolocation params for Flickr API.
 *
 * @param {Object} params - Object of not formatted params.
 *
 * @returns {Object} Formatted params.
 */
function formatGeolocationParams(params) {
  let formatted = {};

  // Add latitude and longitude API params
  if (
    typeof params.geo !== "undefined" &&
    typeof params.geo.lat !== "undefined" &&
    typeof params.geo.lng !== "undefined"
  ) {
    let lat = parseFloat(params.geo.lat);
    let lng = parseFloat(params.geo.lng);

    if (!isNaN(lat) && !isNaN(lng)) {
      // If we use latitude and longitude search only for photos which has this information
      formatted.has_geo = 1;
      formatted.radius = 5;

      formatted.lat = lat;
      formatted.lon = lng;
    }
  }

  return formatted;
}

/**
 * Format license param for Flickr API.
 *
 * @param {Object} params - Object of not formatted params.
 *
 * @returns {Object} Formatted params.
 */
function formatLicenseParam(params) {
  let formatted = {};
  let formattedLicenses = [];

  // Add license API param
  if (typeof params.license !== "undefined") {
    for (let i = 0; i < params.license.length; i++) {
      if (params.license[i].checked) {
        formattedLicenses.push(params.license[i].id);
      }
    }

    if (formattedLicenses.length > 0) {
      formatted.license = formattedLicenses.join(",");
    }
  }

  return formatted;
}

/**
 * Format color param for Flickr API.
 *
 * @param {Object} params - Object of not formatted params.
 *
 * @returns {Object} Formatted params.
 */
function formatColorParam(params) {
  let formatted = {};
  let formattedColors = [];

  // Add color API param
  if (typeof params.color !== "undefined") {
    for (let i = 0; i < params.color.length; i++) {
      if (params.color[i].checked) {
        formattedColors.push(params.color[i].id);
      }
    }

    if (formattedColors.length > 0) {
      formatted.color_codes = formattedColors.join(",");
    }
  }

  return formatted;
}

/**
 * Format date params for Flickr API.
 *
 * @param {Object} params - Object of not formatted params.
 *
 * @returns {Object} Formatted params.
 */
function formatDateParams(params) {
  let formatted = {};

  // Add dateAfter API param
  if (typeof params.dateAfter !== "undefined" && params.dateAfter) {
    let dateAfter = DateTime.fromISO(params.dateAfter)
      .plus({ days: 1 })
      .toFormat("yyyy-MM-dd");

    formatted.min_upload_date = encodeURI(dateAfter);
  }

  // Add dateBefore API param
  if (typeof params.dateBefore !== "undefined" && params.dateBefore) {
    let dateBefore = DateTime.fromISO(params.dateBefore)
      .minus({ days: 1 })
      .toFormat("yyyy-MM-dd");

    formatted.max_upload_date = encodeURI(dateBefore);
  }

  return formatted;
}
