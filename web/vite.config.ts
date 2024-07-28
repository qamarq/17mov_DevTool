import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    base: './',
    build: {
        outDir: 'build',
        target: 'esnext',
    },
    define: {
        'process.env': {},
    },
    esbuild: {
        logOverride: { 'this-is-undefined-in-esm': 'silent' },
    },
    // optimizeDeps: {
    //     exclude: [
    //       'three-mesh-bvh',
    //       'three/addons/renderers/webgl/nodes/WebGLNodes.js',
    //       'three-subdivide',
    //       'web-ifc-three',
    //       'web-ifc',
    //       'three-bvh-csg',
    //       'three-gpu-pathtracer',
    //       'flow',
    //       'three/addons/loaders/IFCLoader.js',
    //     ],
    // },
});
