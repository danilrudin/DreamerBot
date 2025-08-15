import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/**/*.ts'],
	outDir: 'dist',
	format: ['esm'],
	target: 'node22',
	platform: 'node',
	bundle: false, 
	splitting: false,
	sourcemap: true,
	clean: true,
	minify: false,
	dts: false,
	shims: false,
	treeshake: true
});