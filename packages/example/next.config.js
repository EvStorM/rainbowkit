/** @type {import('next').NextConfig} */
module.exports = (phase, { defaultConfig }) => {
  return {
    ...defaultConfig,

    webpack: config => {
      config.resolve = {
        ...config.resolve,
        fallback: {
          assert: false,

          dns: false,

          // fixes mapbox dependencies
          events: false,

          fs: false,

          // fixes proxy-agent dependencies
          net: false,

          // fixes next-i18next dependencies
          path: false,

          // fixes sentry dependencies
          process: false,

          tls: false,
        },
      };
      return config;
    },
  };
};
