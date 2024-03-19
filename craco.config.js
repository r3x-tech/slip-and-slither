// craco.config.js
const webpack = require("webpack");

module.exports = {
  webpack: {
    plugins: [
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"], // Define Buffer globally
      }),
    ],
    configure: {
      resolve: {
        fallback: {
          http: require.resolve("stream-http"),
          https: require.resolve("https-browserify"),
          zlib: require.resolve("browserify-zlib"),
          util: require.resolve("util"),
          url: require.resolve("url/"),
          assert: require.resolve("assert/"),
          stream: require.resolve("stream-browserify"),
          crypto: require.resolve("crypto-browserify"),
          process: require.resolve("process/browser"),
        },
      },
    },
  },
};
