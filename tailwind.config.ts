import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { graphite: '#101315', black: '#171B1F', ivory: '#F4F1EB', titanium: '#92999D', orange: '#EF6C28' } } }, plugins: [] };
export default config;
