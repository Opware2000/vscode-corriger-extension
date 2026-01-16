import { defineConfig } from '@vscode/test-cli';

export default defineConfig([
	{
		label: 'unit',
		files: 'out/test/**/*.test.js',
		exclude: 'out/test/**/*.e2e.test.js',
	},
	{
		label: 'e2e',
		files: 'out/test/**/*.e2e.test.js',
	},
]);
