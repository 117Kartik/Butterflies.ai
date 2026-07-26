import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  // Scan the whole frontend source tree. This prevents a stale/dev-server
  // working-directory issue from producing a page with only Tailwind's reset.
  content: ['app/**/*.{js,ts,jsx,tsx,mdx}', 'components/**/*.{js,ts,jsx,tsx,mdx}', 'lib/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: { ink: '#18222f', lilac: '#7857ff', mist: '#f7f8fc' },
      boxShadow: { card: '0 1px 2px rgba(16,24,40,.04), 0 4px 16px rgba(16,24,40,.05)' },
    },
  },
  plugins: [],
};

export default config;
