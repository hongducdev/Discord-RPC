import path from 'path';
import fs from 'fs';
export default {
	path: '/dino',
	run: async (req, res) => {
		// Check path correct with fs
		let pathCorrect = path.resolve('.', 'src', 'Assets', 'dino', 'index.html');
		// check if path exists
		if (!fs.existsSync(pathCorrect)) {
			pathCorrect = path.resolve(
				'.',
				'resources',
				'app',
				'src',
				'Assets',
				'dino',
				'index.html',
			);
		}
		res.sendFile(pathCorrect);
		// res.sendFile(path.resolve('.', 'src', 'Views', 'index.html'));
	},
};