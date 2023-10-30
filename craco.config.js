module.exports = {
    style: {
        sass: {
            loaderOptions: {
                additionalData: `
          @import "src/styles/_variables.scss";
          @import "src/styles/_constants.scss";
          @import "src/styles/_mixins.scss";
        `,
            },
        },
    },
    webpack: {
        configure: {
            resolve: {
                fallback: {
                    "crypto": require.resolve("crypto-browserify"),
                    "stream": require.resolve('stream-browserify'),
                }
            },
        },
    },
};