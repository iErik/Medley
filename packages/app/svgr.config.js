export default {
  outDir: './src/frontend/components/Icon/components',
  ref: true,
  dimensions: false,
  typescript: true,
  svgo: true,
  svgoConfig: {
    plugins: [
      'prefixIds',
      { // Removes the each occurrence of the 'fill'
        // attribute in the generated icon component files
        name: 'removeAttrs',
        params: { attrs: 'fill' }
      },
    ]
  }
}
