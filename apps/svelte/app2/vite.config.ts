import { defineConfig, type UserConfig } from 'vite'
import type { TransformResult, PreRenderedChunk } from 'rollup';
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { join } from 'node:path';

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
              input: ['index.html', join(process.cwd(), 'node_modules/svelte/src/runtime/index.js')],
              output: {
                manualChunks: function (id: string): string | undefined {
                  if (id.includes('/axios/')) {
                    return 'axios';
                  }
                  if (id.includes('/svelte/src/')) {
                    return 'svelte';
                  }
                },

                entryFileNames: function (chunkInfo: PreRenderedChunk): string {
                  let fileName = 'assets/[name].[hash].js';
                  if (chunkInfo.facadeModuleId?.includes('/svelte/src/runtime/index.js')) {
                    fileName = `assets/svelte.[hash].js`;
                  }
                  return fileName;
                },
              },
              preserveEntrySignatures: 'allow-extension',
            },
          },
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
