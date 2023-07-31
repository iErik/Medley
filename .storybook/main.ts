import { mergeConfig } from 'vite'
import { join, resolve } from 'path'
import { mdxIndexer, csfIndexer } from './indexers'
import svgr from 'vite-plugin-svgr'


const packagesPaths = [
  '../packages/components',
//  '../packages/app',
];

const appPath = resolve('./packages/app/src/renderer')

export default {
  stories: packagesPaths.flatMap(path => [
    `${path}/**/*/story/index.@(js|jsx|ts|tsx|mdx)`,
    `${path}/**/*.story.@(js|jsx|ts|tsx|mdx)`,
    `${path}/**/*.stories.@(js|jsx|ts|tsx|mdx)`
  ]),

  storyIndexers: (indexers: any[]) => ([
    {
      test: /\.mdx?$/,
      indexer: mdxIndexer,
    },
    {
      test: /\.[tj]sx?$/,
      indexer: csfIndexer,
    },
    ...(indexers || []),
  ]),

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    '@storybook/addon-mdx-gfm',
    'storybook-dark-mode',
  ],
  core: {
    builder: "@storybook/builder-vite"
  },
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  docs: {
    autodocs: true
  },

  viteFinal: async (config) => mergeConfig(config, {
    resolve: {
      alias: {
        '@': join(appPath, 'src'),
        '@pkg': join(appPath, '../../'),
        '@root': join(appPath, '../../src'),
        '@hooks': join(appPath, 'src/hooks'),
        '@parser': join(appPath, 'src/parser'),
        '@api': join(appPath, 'src/api'),
        '@components': join(appPath, 'src/components'),
        '@containers': join(appPath, 'src/containers'),
        '@store': join(appPath, 'src/store'),
        '@styles': join(appPath, 'src/styles'),
        '@static': join(appPath, 'src/static'),
        '@utils': join(appPath, 'src/utils'),
        '@modules': join(appPath, 'src/modules'),
        '@views': join(appPath, 'src/views'),
      }
    },
    plugins: [ svgr() ],
    define: { __APP_ENV__: {} },
    optimizeDeps: {
      include: [ 'storybook-dark-mode' ]
    }
  })
};
