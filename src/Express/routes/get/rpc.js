import path from "path";
export default {
	path: '/rpc',
	run: async (req, res) => {
		res.sendFile(path.resolve('.', 'src', 'Views', 'index.html'));
		// res.sendFile(path.resolve('.', 'index.html'));
	},
};
