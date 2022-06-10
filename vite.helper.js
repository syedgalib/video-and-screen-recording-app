function getAssetDestination ( assetName, mode ) {
    const imageFormats = [ 'svg', 'png', 'jpg', 'jpeg' ];
    const fontFormats  = [ 'ttf' ];
    const maybeMin     = ( 'development' == mode ) ? '' : '.min';

    let ext = assetName.match( /\.(.+)$/ );
    ext = ( ext && ext.length > 1 ) ? ext[1] : '';

    if ( 'js' === ext ) {
        return `[name]${maybeMin}[extname]`;
    }

    if ( 'css' === ext ) {
        return `css/[name]${maybeMin}[extname]`;
    }

    if ( imageFormats.includes( ext ) ) {
        return `images/[name][extname]`;
    }

    if ( fontFormats.includes( ext ) ) {
        return `fonts/[name][extname]`;
    }

    return `other/[name][extname]`;
}

export { getAssetDestination };