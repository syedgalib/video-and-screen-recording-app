import { getAssetDestination } from './vite.helper';

let userConfig = null;

// Try to get user confguartion
try {
    const maybeUserConfig = require( './vite.user-config.js' );
    userConfig = maybeUserConfig.userConfig;
    
} catch( _ ) { }

// Project Config
function projectConfig( mode ) {

    // Common Config
    const commonConfig = {
        destDir: 'assets/',
        server: {
            cors: true,
            strictPort: true,
            port: 3000
        },
    };

    // Dev Config
    const devConfig = {
        minify: false,
        entryFileNames: commonConfig.destDir + 'js/[name].js',
        assetFileNames: function( assetInfo ) {
            return commonConfig.destDir + getAssetDestination( assetInfo.name, 'development' );
        },
        server: commonConfig.server,
    };

    // Prod Config
    const prodConfig = {
        minify: true,
        entryFileNames: commonConfig.destDir + 'js/[name].min.js',
        assetFileNames: function( assetInfo ) {
            return commonConfig.destDir + getAssetDestination( assetInfo.name, 'production' );
        },
        server: commonConfig.server,
    };

    let config = ( 'development' == mode ) ? devConfig : prodConfig;

    // Override with user config if exist
    if ( typeof userConfig !== 'undefined' && typeof userConfig === 'function' ) {
        config = userConfig( config, commonConfig, mode );
    }

    return config;
}

export default projectConfig;