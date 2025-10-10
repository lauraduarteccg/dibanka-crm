import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [
        laravel({
            input: [
                "resources/css/app.css",
                "resources/js/index.jsx",
            ],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "resources/js"),
            "@api": path.resolve(__dirname, "resources/js/api"),
            "@layouts": path.resolve(__dirname, "resources/js/layouts"),
            "@components": path.resolve(__dirname, "resources/js/components"),
            "@pages": path.resolve(__dirname, "resources/js/pages"),
            "@modules": path.resolve(__dirname, "resources/js/modules"),
            "@context": path.resolve(__dirname, "resources/js/context"),
            "@styles": path.resolve(__dirname, "resources/css"),
            "@assets": path.resolve(__dirname, "resources/assets"),
            "@hooks": path.resolve(__dirname, "resources/js/hooks"),
        },
    },
});
