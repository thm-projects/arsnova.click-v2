module.exports = {
  navigateFallback: '/index.html',
  stripPrefix: 'dist',
  root: 'dist/',
  staticFileGlobs: [
    'dist/**/*.{html,css,js,jpg,png,woff?,ttf,svg,eot,otf,json}'
  ],
  maximumFileSizeToCacheInBytes: 3000000,
  verbose: true
};
