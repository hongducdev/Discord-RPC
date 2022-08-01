import path from "path";
import fs from "fs";
export default {
	path: '/rpc',
	run: async (req, res) => {
		// Check path correct with fs
		let pathCorrect = path.resolve('.', 'src', 'Views', 'index.html');
		// check if path exists
		if (!fs.existsSync(pathCorrect)) {
			pathCorrect = path.resolve(
				'.',
				'resources',
				'app',
				'src',
				'Views',
				'index.html',
			);
		}
		res.sendFile(pathCorrect);
		// res.sendFile(path.resolve('.', 'index.html'));
	},
};
