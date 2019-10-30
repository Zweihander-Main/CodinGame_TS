/*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
import { NUM_PODS } from './constants';
import Game from './game';

const game = new Game();
game.updateLaps(parseInt(readline(), 10));
game.updateCheckpointCount(parseInt(readline(), 10));
for (let i = 0, len = game.checkpointCount; i < len; i++) {
	const [checkpointX, checkpointY] = readline()
		.split(' ')
		.map((a) => parseInt(a, 10));
	game.addCheckpoint(checkpointX, checkpointY);
}

// game loop
while (true) {
	for (let i = 0; i < NUM_PODS; i++) {
		const [x, y, vx, vy, angle, nextCheckPointId] = readline()
			.split(' ')
			.map((a) => parseInt(a, 10));
		game.updatePods(i, x, y, vx, vy, angle, nextCheckPointId);
	}
	game.calculate();
	game.output();

	/*Implement way to target perim - 100, not center?
	Calculate velocity, compensate for it*/

	// if (DEVMSG) {
	// 	console.error('Speed:       ' + speed);
	// 	console.error('RecMaxSpeed: ' + recMaxSpeed);
	// 	console.error('Thrust:      ' + thrust);
	// 	console.error('Angle:       ' + nextAngle);
	// 	console.error('DriftAngle:       ' + driftAngle);
	// }

	// const driftAngle = findAngleBetweenThreePoints(lastCheckPointLoc, lastLoc, loc);
	game.turns++;
}
