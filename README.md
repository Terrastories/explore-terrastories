# Explore Terrastories

Explore Terrastories is a web application that allows public exploration of unrestricted stories on a Terrastories server, that communities have opted into sharing. Explore Terrastories queries the API of the main [Terrastories application](https://github.com/terrastories/terrastories).

Explore Terrastories is built with React and uses TypeScript for strong typing, Axios for API requests, and [MapLibre GL JS](https://github.com/maplibre/maplibre-gl-js) with [Protomaps](https://github.com/protomaps) for map rendering.

For more information on how to use Explore Terrastories, please visit the Terrastories Support Materials at **[https://docs.terrastories.app/](https://docs.terrastories.app/)**.


## Connecting Explore to a Terrastories API

To use this application, you will need to have a [Terrastories](https://github.com/terrastories/terrastories) server up and running, 
and defined as the API source in the `VITE_API_BASE` variable in this application's `.env` file. You will also need to ensure 
that your Explore Terrastories server has permission to make requests to the Terrastories API by adding your Explore Terrastories host 
to the `CORS_ORIGINS` variable in the Terrastories server `.env.api` file.

## How to Deploy

This project was bootstrapped with [Vite](https://github.com/vitejs/vite).

To install your Node packages for the first time, run `npm install`.

To start the application in development mode, run `npm run start`. Open [http://localhost:3000](http://localhost:3000) to view the app in the browser.

If you are setting up for a production environment,run `npm run build` to build the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed! Run `npm run serve`.
