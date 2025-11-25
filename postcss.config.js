module.exports = {
  plugins: {
    'postcss-import': {
      resolve(id, basedir, importOptions) {
        if (id && id.startsWith('~')) {
          return id.slice(1);
        }

        return id;
      },
    },
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
  },
}
