module.exports = {
  navigateFallback: '/index.html',
	navigateFallbackWhitelist: [/^\/([^backend]+)\//],
  stripPrefix: 'dist',
  root: 'dist/',
  staticFileGlobs: [
    'dist/**/*.{html,css,js,jpg,png,woff?,ttf,svg,eot,otf,json,gz}'
  ],
  maximumFileSizeToCacheInBytes: 3000000,
  verbose: true
};
