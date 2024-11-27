import type { Config } from 'tailwindcss'

export default {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	prefix: 'pf-',
	corePlugins: {
		preflight: false,
	},
	theme: {
		extend: {
			colors: {
				light: 'hsl(var(--light))',
				dark: 'hsl(var(--dark))',
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				toggle: 'hsl(var(--toggle))',
				bg: 'hsl(var(--bg))',
				fg: 'hsl(var(--fg))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					fg: 'hsl(var(--primary-fg))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					fg: 'hsl(var(--secondary-fg))',
				},
				tertiary: {
					DEFAULT: 'hsl(var(--tertiary))',
					fg: 'hsl(var(--tertiary-fg))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					fg: 'hsl(var(--accent-fg))',
					subtle: 'hsl(var(--accent-subtle))',
					'subtle-fg': 'hsl(var(--accent-subtle-fg))',
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					fg: 'hsl(var(--success-fg))',
				},
				info: {
					DEFAULT: 'hsl(var(--info))',
					fg: 'hsl(var(--info-fg))',
				},
				danger: {
					DEFAULT: 'hsl(var(--danger))',
					fg: 'hsl(var(--danger-fg))',
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					fg: 'hsl(var(--warning-fg))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					fg: 'hsl(var(--muted-fg))',
				},
				overlay: {
					DEFAULT: 'hsl(var(--overlay))',
					fg: 'hsl(var(--overlay-fg))',
				},
			},
			borderRadius: {
				'3xl': 'calc(var(--radius) + 6px)',
				'2xl': 'calc(var(--radius) + 4px)',
				xl: 'calc(var(--radius) + 2px)',
				lg: 'calc(var(--radius))',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
		},
	},
	plugins: [],
} satisfies Config
