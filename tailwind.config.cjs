module.exports = {
	content: ['./src/Views/**/*.{html,js}'],
	theme: {
		extend: {
			fontFamily: {
				OpenSans: ['Open Sans', 'sans-serif'],
			},
		},
	},
	plugins: [require('tailwind-scrollbar')],
	variants: {
		scrollbar: ['rounded'],
	},
};
