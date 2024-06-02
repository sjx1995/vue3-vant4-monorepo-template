import path from 'node:path'
import process from 'node:process'
import { loadEnv } from 'vite'
import type { ConfigEnv, UserConfig } from 'vite'
import viewport from 'postcss-mobile-forever'
import autoprefixer from 'autoprefixer'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import { viteVConsole } from 'vite-plugin-vconsole'
import conditionalImportPlugin from 'vite-plugin-conditional-import'

export default ({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, root)

  return {
    base: env.VITE_APP_PUBLIC_PATH,
    plugins: [
      // https://github.com/posva/unplugin-vue-router
      VueRouter({
        extensions: ['.vue'],
        routesFolder: 'src/pages',
        dts: 'src/typed-router.d.ts',
      }),

      vue(),

      // https://github.com/antfu/unplugin-vue-components
      Components({
        extensions: ['vue'],
        resolvers: [VantResolver()],
        include: [/\.vue$/, /\.vue\?vue/],
        dts: 'src/components.d.ts',
      }),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
        imports: [
          'vue',
          '@vueuse/core',
          VueRouterAutoImports,
          {
            'vue-router/auto': ['useLink'],
          },
        ],
        dts: 'src/auto-imports.d.ts',
        dirs: ['src/composables'],
      }),

      legacy({
        targets: ['defaults', 'not IE 11'],
      }),

      // https://github.com/vadxq/vite-plugin-vconsole
      viteVConsole({
        entry: [path.resolve('src/main.ts')],
        enabled: false,
        config: {
          maxLogNumber: 1000,
          theme: 'light',
        },
        // https://github.com/vadxq/vite-plugin-vconsole/issues/21
        dynamicConfig: {
          theme: `document.documentElement.classList.contains('dark') ? 'dark' : 'light'`,
        },
        eventListener: `
          const targetElement = document.querySelector('html'); // 择要监听的元素
          const observerOptions = {
            attributes: true, // 监听属性变化
            attributeFilter: ['class'] // 只监听class属性变化
          };
    
          // 定义回调函数来处理观察到的变化
          function handleAttributeChange(mutationsList) {
            for(let mutation of mutationsList) {
              if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (window && window.vConsole) {
                  window.vConsole.dynamicChange.value = new Date().getTime();
                }
              }
            }
          }
    
          // 创建观察者实例并传入回调函数
          const observer = new MutationObserver(handleAttributeChange);
    
          // 开始观察目标元素
          observer.observe(targetElement, observerOptions);
    
          // 当不再需要观察时，停止观察
          // observer.disconnect();
        `,
      }),

      // https://github.com/vuejs/devtools-next
      VueDevTools(),

      conditionalImportPlugin({
        currentEnv: mode,
        envs: ['development', 'production'],
      }),
    ],

    server: {
      host: true,
      port: 3000,
      proxy: {
        '/api': {
          target: '',
          ws: false,
          changeOrigin: true,
        },
      },
    },

    resolve: {
      alias: {
        '~@': path.join(__dirname, './src'),
        '@': path.join(__dirname, './src'),
        '~': path.join(__dirname, './src/assets'),
      },
    },

    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          // https://github.com/wswmsword/postcss-mobile-forever
          viewport({
            appSelector: '#app',
            viewportWidth: 375,
            maxDisplayWidth: 600,
            rootContainingBlockSelectorList: ['van-tabbar', 'van-popup'],
          }),
        ],
      },
    },

    build: {
      cssCodeSplit: false,
      chunkSizeWarningLimit: 2048,
    },

    optimizeDeps: {
      include: ['lodash-es'],
    },
  }
}
