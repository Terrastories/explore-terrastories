# Explore Terrastories

Explore Terrastories is a web application that allows public exploration of unrestricted stories that communities have opted into sharing. Explore Terrastories queries the API of the main [Terrastories application](https://github.com/terrastories/terrastories).

Explore Terrastories is built with React+Vite and uses TypeScript for strong typing, Axios for API requests, and [MapLibre GL JS](https://github.com/maplibre/maplibre-gl-js) with [Protomaps](https://github.com/protomaps) for map rendering.

For more information on how to use Explore Terrastories, please visit the Terrastories Support Materials at **[https://docs.terrastories.app/](https://docs.terrastories.app/)**.


## Connecting Explore to a Terrastories API

To use this application, you will need to have a [Terrastories](https://github.com/terrastories/terrastories) server up and running, 
and defined as the API source in the `REACT_APP_API_BASE` variable in this application's `.env` file. You will also need to ensure 
that your Explore Terrastories site has permission to make requests to the Terrastories API by adding your Explore Terrastories host 
to the `CORS_ORIGINS` variable in the Terrastories server `.env` file.
## Available Scripts

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), and uses the default scripts provided.

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the 
single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your 
project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied 
scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel
obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are 
ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
