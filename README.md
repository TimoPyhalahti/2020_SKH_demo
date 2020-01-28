# Seurantakiinnostusdemo

This is an app that calculates and shows the level of interest of getting observations near determined points on a map. It uses SYKE's CitobsDB-system.

Deployed here: <https://avoinorg.github.io/seurantakiinnostus-demo/>.

Created using React, TypeScript, and Leaflet.


## Development

You can set up the project with

    npm install

### Using development server

    npm start

By default, the server can be accessed at <localhost:8080>.

### Type-checking

TypeScript type-checking can manually be run with

    npm run type-check

### Building

For the app to function correctly a working CitobsDB I-API key must be declared in the env variables as API_KEY before building. For example

    export API_KEY='your-api-key-here'

Build the bundle into the dist folder with

    npm run build

### Deploying

The app is deployed on github pages. After running the build command, deploy with

    npm run deploy

Alternatively the bundle can be manually deployed to any other server, such as an AWS S3 bucket.
