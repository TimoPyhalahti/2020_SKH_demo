module.exports = api => {
  api.cache(false);

  const presets = ['@babel/env', '@babel/typescript', '@babel/react'];
  const plugins = [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ],
    ['transform-define', { API_KEY: process.env.API_KEY }],
  ];

  return {
    presets,
    plugins,
  };
};
