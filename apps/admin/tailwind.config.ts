import type { Config } from 'tailwindcss';
import tokensPreset from '../../packages/tokens/tailwind.preset';

const config: Config = {
  presets: [tokensPreset as Config],
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
