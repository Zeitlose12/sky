import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess({ script: true }),
    ssr: {
        noExternal: process.env.NODE_ENV === 'production' ? ['@napi-rs/canvas'] : []
    },
    optimizeDeps: {
        include: ['fs']
    },
    kit: {
        adapter: adapter({
            runtime: 'nodejs18.x'
        }),
        alias: {
            $params: './src/params',
            $types: './src/lib/types',
            $db: './src/db',
            $constants: './src/lib/server/constants',
            $ctx: './src/context'
        },
        csrf: {
            checkOrigin: true
        },
        serviceWorker: {
            register: false
        }
    },
    onwarn: (warning, handler) => {
        if (warning.filename.includes('node_modules')) return;
        handler(warning);
    },
    vitePlugin: {
        dynamicCompileOptions({ filename, compileOptions }) {
            if (!filename.match(/[\\/\\]node_modules[\\/\\]/) && !compileOptions.runes) {
                return { runes: true };
            }
        }
    }
};

export default config;