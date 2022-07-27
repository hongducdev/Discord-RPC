import path from 'path';
export default {
	path: '/dino',
	run: async (req, res) => {
		// res.sendFile(path.resolve('.', 'src', 'Views', 'index.html'));
		res.sendFile(path.resolve('.', 'src', 'Assets', 'dino', 'index.html'));
	},
};