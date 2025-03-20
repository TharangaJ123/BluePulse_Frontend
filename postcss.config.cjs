module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-nested'),
    require('@tailwindcss/postcss'), // Use this instead of 'tailwindcss'
    require('autoprefixer'),
  ],
};
