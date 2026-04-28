const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
	presets: [require('nativewind/preset')],
	theme: {
		extend: {
			colors: {
				// ── CSS variable tokens ───────────────────────────────────────────────────
				border: 'var(--border)',
				input: 'var(--input)',
				ring: 'var(--ring)',
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				overlay: 'var(--overlay)',
				primary: {
					DEFAULT: 'var(--primary)',
					foreground: 'var(--primary-foreground)',
				},
				secondary: {
					DEFAULT: 'var(--secondary)',
					foreground: 'var(--secondary-foreground)',
				},
				destructive: {
					DEFAULT: 'var(--destructive)',
					foreground: 'var(--destructive-foreground)',
				},
				muted: {
					DEFAULT: 'var(--muted)',
					foreground: 'var(--muted-foreground)',
				},
				accent: {
					DEFAULT: 'var(--accent)',
					foreground: 'var(--accent-foreground)',
				},
				card: {
					DEFAULT: 'var(--card)',
					foreground: 'var(--card-foreground)',
				},

				// Brand
				brandMedium: 'var(--brand-medium)',
				'brand-purple': 'var(--brand-purple)',
				'brand-red': 'var(--destructive-red)',

				// App-specific
				heading: 'var(--heading)',
				popover: 'var(--popover)',

				// district-clone Orange
				'district_clone_orange': 'var(--district_clone_orange)',
			},
			spacing: {
				'xxs': '2px',
				'xs': '4px',
				'sm': '8px',
				'md': '12px',
				'lg': '16px',
				'xl': '20px',
				'xxl': '24px',
				'xxxl': '32px',
				'jumbo': '48px',
				'mega': '64px',
				'140': '140px',
				'sidebar': '120px',
				'menu': '210px',
				'hotlist-icon': '200px',
			},
			fontFamily: {
				sans: 'Manrope-Regular',
				primary: 'Oswald-Regular',
				'primary-medium': 'Oswald-Medium',
				'primary-semibold': 'Oswald-SemiBold',
				'primary-bold': 'Oswald-Bold',
				secondary: 'Manrope-Regular',
				'secondary-medium': 'Manrope-Medium',
				'secondary-semibold': 'Manrope-SemiBold',
				'secondary-bold': 'Manrope-Bold',
			},
			fontSize: {
				'xs': '10px',
				'sm': '12px',
				'base': '14px',
				'md': '16px',
				'lg': '18px',
				'xl': '20px',
				'xxl': '24px',
				'xxxl': '28px',
				'display': '32px',
				'hero': '40px',
			},
			zIndex: {
				'base': '0',
				'raised': '10',
				'overlay': '20',
				'modal': '30',
				'toast': '40',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			borderWidth: {
				hairline: hairlineWidth(),
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
			maxWidth: {
				'1440': '1440px',
			},
			width: {
				'100': '100px',
				'140': '140px',
			},
			height: {
				'100': '100px',
				'140': '140px',
				'200': '200px',
			},
			minHeight: {
				'250': '250px',
			}
		},
	},
	future: {
		hoverOnlyWhenSupported: true,
	},
	plugins: [require('tailwindcss-animate')],
};
