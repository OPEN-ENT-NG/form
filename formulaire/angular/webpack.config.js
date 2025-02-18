var path = require('path');

module.exports = {
    entry: {
        application: './formulaire/angular/src/ts/app.ts',
        behaviours: './formulaire/angular/src/ts/behaviours.ts'
    },
    output: {
        filename: '[name].js',
        path: __dirname + 'dest'
    },
    externals: {
        "entcore/entcore": "entcore",
        "entcore": "entcore",
        "moment": "entcore",
        "underscore": "entcore",
        "jquery": "entcore",
        "angular": "angular"
    },
    resolve: {
        modulesDirectories: ['angular/node_modules'],
        root: path.resolve(__dirname),
        extensions: ['', '.ts', '.js'],
        alias: {
            "@common": path.resolve(__dirname, '../../common/src/main/resources/ts'),
            "@formulairepublic": path.resolve(__dirname, '../../formulaire-public/angular/src/ts')
        }
    },
    devtool: "source-map",
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            }
        ]
    }
};
