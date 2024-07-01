import { defineConfig, type UserConfig } from 'vite'
import type { TransformResult } from 'rollup';
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: false,
  },

  plugins: [
    svelte(),
    {
      name: 'vite-plugin-chunk-split',
      apply: 'build',
      enforce: 'post',

      config: function (config: UserConfig): Omit<UserConfig, 'plugins'> {
        return {
          ...config,
          build: {
            ...config.build,
            rollupOptions: {
              ...config.build?.rollupOptions,
              output: {
                manualChunks: function (id: string): string | undefined {
                  if (id.includes('/axios/')) {
                    return 'axios';
                  }
                  if (id.includes('/svelte/src/')) {
                    return 'svelte';
                  }
                }
              },
            }
          }
        };
      },

      transform: function (_: string, id: string): TransformResult {
        if (id.includes('/axios/')) {
          return {
            moduleSideEffects: 'no-treeshake'
          };
        }
        if (id.includes('/svelte/src/')) {
          return {
            moduleSideEffects: 'no-treeshake'
          };
        }
      }
    }
  ],
})
