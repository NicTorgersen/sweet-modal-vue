import { resolve } from 'path';
import {defineConfig} from 'vite';
import vue from "@vitejs/plugin-vue2";

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/main.js'),
            formats: ['es', 'umd'],
            name: "SweetModal",
            fileName: (format) => `sweet-modal.${format}.js`,
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: "Vue",
                },
            },
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
            },
        },
    },
});

