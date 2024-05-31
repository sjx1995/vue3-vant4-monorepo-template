import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
    build: {
        target: 'modules',
        // 压缩
        minify: true,
        rollupOptions: {
          // 忽略打包vue文件
          external: ['vue'],
          input: ['src/index.ts'],
          output: [
            {
              format: 'es',
              entryFileNames: '[name].js',
              preserveModules: true,
              // 配置打包根目录
              dir: 'dist/es',
              preserveModulesRoot: 'src'
            },
            {
              format: 'cjs',
              entryFileNames: '[name].js',
              preserveModules: true,
              dir: 'dist/lib',
              preserveModulesRoot: 'src'
            }
          ]
        },
        lib: {
          entry: './index.js',
          formats: ['es', 'cjs']
        }
      },
})
