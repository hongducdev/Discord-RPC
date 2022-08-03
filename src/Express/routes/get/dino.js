import path from 'path';
import fs from 'fs';
export default {
	path: '/dino',
	run: async (req, res) => {
		// Check path correct with fs
		let pathCorrect = path.resolve(process.env.APPDIR || '.', 'src', 'Assets', 'dino', 'index.html');
		// check if path exists
		if (!fs.existsSync(pathCorrect)) {
			pathCorrect = path.resolve(
				process.env.APPDIR || '.',
				'resources',
				'app',
				'src',
				'Assets',
				'dino',
				'index.html',
			);
		}
		res.sendFile(pathCorrect);
		// res.sendFile(path.resolve(process.env.APPDIR || '.', 'src', 'Views', 'index.html'));
	},
};