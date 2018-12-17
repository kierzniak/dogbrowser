# DogBrowser :dog:

DogBrowser is simple real world Vue application to browse dog photos using Flickr API.

## What application do?
- [x] Fetch first 100 dog photos from Flickr API with captions author, date, description
- [x] Fetch more photos when user scroll to the bottom of the page
- [x] Filter photos by license, color and date filters
- [x] Filter photos by search query on dedicated route
- [x] Filter photos by author on dedicated route
- [x] Fetch photos using gelocation API and Flickr API geolocation filters and show them on Google Maps
- [x] Application can work in offline mode when network is not available and can be added to homescreen of the smartphone.
- [x] Application will handle all errors which might occur and show user nice notification about problem or redirect him to error page. Additionaly all errors will be sent to Sentry to log them for developers. In development mode developer will get notification about error and hint to check browser console.

## Development setup

### Clone project
```
git clone git@github.com:kierzniak/dogbrowser.git
cd dogbrowser
```

### Copy dotenv and fill with your properties
```
cp .env.example .env
```

### Install dependencies
```
npm install
```

### Start project
```
npm run dev
```

### Code inspection
Be sure to execute code inspection and test before before making a pull request.
```
npm run inspect
```
