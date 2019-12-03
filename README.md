# React quickstart template

This is a quickstart react template for fast prototyping. It has type-checking with TypeScript, but will compile regardless of the type errors.

Utilizes Styled Components, Webpack, and Babel.

### Using development server

```shell
npm start
```

### Building

```shell
npm run build
```

### Type-checking

```shell
npm run type-check
```

## Docker  
A docker image for this repository can be found [here.](https://hub.docker.com/repository/docker/xbexbex/react-quickstart-template)  
### Running and installing
```shell
docker run -p 5000:5000 xbexbex/react-quickstart-template
```
### Or building locally
```shell
docker build . -t <name-for-the-project>
docker run <name-for-the-project>
```

