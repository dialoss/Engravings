module.exports = {
    style: {
        sass: {
            loaderOptions: {
                additionalData: `
          @import "src/styles/_variables.scss";
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
            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        resolve: {
                            fullySpecified: false,
                        },
                    },
                ],
            },
        },
    },
};