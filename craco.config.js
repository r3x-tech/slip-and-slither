// craco.config.js
const webpack = require("webpack");

module.exports = {
  webpack: {
    plugins: [
      new webpack.DefinePlugin({
        "process.env.REACT_APP_SUPABASE_URL": JSON.stringify(
          process.env.REACT_APP_SUPABASE_URL
        ),
        "process.env.REACT_APP_SUPABASE_ANON_KEY": JSON.stringify(
          process.env.REACT_APP_SUPABASE_ANON_KEY
        ),
        "process.env.REACT_APP_ENDPOINT": JSON.stringify(
          process.env.REACT_APP_ENDPOINT
        ),
        "process.env.REACT_APP_PARTICLE_PROJECT_ID": JSON.stringify(
          process.env.REACT_APP_PARTICLE_PROJECT_ID
        ),
        "process.env.REACT_APP_PARTICLE_CLIENT_KEY": JSON.stringify(
          process.env.REACT_APP_PARTICLE_CLIENT_KEY
        ),
        "process.env.REACT_APP_PARTICLE_APP_ID": JSON.stringify(
          process.env.REACT_APP_PARTICLE_APP_ID
        ),
      }),
      new webpack.ProvidePlugin({
        process: "process/browser",
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
