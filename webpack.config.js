const path = require('path');
const webpack = require('webpack');
const copyPlugin = require('copy-webpack-plugin');

const basicConfig = {
    module: {
        rules: [{
            test: /\.[tj]sx?$/u,
            exclude: '/node_modules/',
            use: [{
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                },
            }],
        }],
    },
    resolve: {
        symlinks: false,
        extensions: [
            '.ts',
            '.js',
        ],
    },
    watchOptions: {
        ignored: ['node_modules'],
    },
};

const devServerConfig = {
    lazy: true,
    filename: 'index.js',
    contentBase: path.join(__dirname, 'dist', 'dev'),
    historyApiFallback: true,
    port: 8080,
    open: true,
    openPage: 'web/',
};

const configs = [{
    ...basicConfig,
    devServer: devServerConfig, // when exporting multiple configurations only the devServer options for the first configuration will be taken into account and used for all the configurations in the array.
    target: 'web',
    entry: [path.join(__dirname, 'src', 'web', 'index.tsx')],
    resolve: {
        ...basicConfig.resolve,
        extensions: [
            ...basicConfig.resolve.extensions,
            '.tsx',
            '.jsx',
        ],
    },
    output: {
        filename: 'index.js',
        pathEnd: 'web',
    },
    plugins: [
        new copyPlugin({
            patterns: [
                {from: 'src/web/index.html', to: 'index.html'},
            ],
        }),
        new webpack.DefinePlugin({
            'process.env.BUILD_ENV': `'${process.env.BUILD_ENV}'`,
        }),
    ],
    module: {
        ...basicConfig.module,
        rules: [
            ...basicConfig.module.rules, {
                test: /\.scss$/u,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    ['autoprefixer', {}]
                                ],
                            },
                        },
                    },
                    'sass-loader',
                ],
            }, {
                test: /\.svg$/u,
                use: [{
                    loader: 'svg-url-loader',
                    options: {
                        limit: 10000,
                    },
                }],
            }, {
                test: /\.png$/u,
                use: [{
                    loader: 'url-loader',
                    options: {mimetype: 'image/png'},
                }],
            },
        ],
    },
}];

if (process.env.BUILD_ENV === 'production') {
    module.exports = configs.map(config => ({
        ...config,
        mode: 'production',
        output: {
            filename: config.output.filename,
            path: path.resolve(__dirname, 'docs'),
            libraryTarget: config.output.libraryTarget,
        }
    }));
} else {
    module.exports = configs.map(config => ({
        ...config,
        mode: 'development',
        output: {
            filename: config.output.filename,
            path: path.resolve(__dirname, 'dist', 'dev', config.output.pathEnd),
            libraryTarget: config.output.libraryTarget,
        },
        devtool: 'source-map',
    }));
}
