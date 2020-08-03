import 'reflect-metadata'
import App from './App.svelte';

process.env.TATUM_API_KEY = '';

const app = new App({
	target: document.body,
});

window.app = app;

export default app;