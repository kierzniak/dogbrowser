export default {
  apiKey: process.env.FLICKR_API_KEY,
  apiUrl: "https://api.flickr.com/services/rest",
  apiTimeout: 10000,
  apiDefaultQuery: {
    format: "json",
    nojsoncallback: 1
  },
  apiDefaultSearchQuery: {
    method: "flickr.photos.search",
    text: "dog",
    per_page: 100,
    page: 1,
    extras: "description,owner_name,url_m,url_o,url_sq,date_upload,geo"
  },

  sentryDNS: process.env.SENTRY_DNS,

  // How many images have to be preloaded before showing any photos
  preloadCount: 6,

  // How many pixels before document bottom infinite scroll should start
  infiniteScrollOffset: 100,
  infiniteScrollEventTreshhold: 300,

  // Google maps config
  gmapKey: process.env.GOOGLE_MAPS_API_KEY,
  gmapSrc: "https://maps.googleapis.com/maps/api/js?key=",
  gmapClusterSrc:
    "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js",

  gmapDefaultLocation: { lat: 52.229676, lng: 21.012229 }, // Warsaw
  gmapDefaultZoom: 12,

  gmapPerPage: 500 // Maximum allowed value by flickr API
};
