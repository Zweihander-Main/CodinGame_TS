const { watch } = require('gulp');
const minipack = require('minipack_ts');

function packTS(cb) {
	minipack(
		'./codersStrikeBack/main.ts',
		'./build/codersStrikeBack.ts',
		'./codersStrikeBack/interfaces.d.ts'
	);
	cb();
}

exports.default = packTS;
exports.watch = () => {
	watch('codersStrikeBack/**/*.ts', packTS);
};
