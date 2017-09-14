module.exports = {
  navigateFallback: '/index.html',
  stripPrefix: 'dist',
  root: 'dist/',
  staticFileGlobs: [
    'dist/index.html',
    'dist/**.js',
    'dist/**.css',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/bootstrap.min.css/bootstrap.min.css'
  ],
  verbose: true
};
