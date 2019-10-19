/*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
const CHECK_POINT_SIZE_BUFFER = 400;
const MAX_SPEED = 800;
const MIN_THRUST = 10;
const BOOST = -1;
const DEVMSG = true;
const NUM_PODS = 4;

interface Coord {
	x: number;
	y: number;
}

function distanceBetweenTwoPoints(point1: Coord, point2: Coord): number {
	return Math.hypot(point2.x - point1.x, point2.y - point1.y);
}

function isWithin(toCheck: number, within: number): boolean {
	return Math.abs(toCheck) < within;
}

/*
 * Calculates the angle ABC (in radians)
 *
 * A first point, ex: {x: 0, y: 0}
 * C second point
 * B center point
 */
function findDriftAngle(A: Coord, B: Coord, C: Coord): number {
	const AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
	const BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
	const AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
	const rad = Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
	return (rad * 180) / Math.PI;
}

function driftCompensate(Dest: Coord, Cur: Coord, Prev: Coord): Coord {
	const target = {} as Coord;
	target.x = Dest.x - (Cur.x - Prev.x);
	target.y = Dest.y - (Cur.y - Prev.y);
	return target;
}

class Pod {
	loc: Coord;
	vx: number;
	vy: number;
	angle: number;
	nextCheckPointId: number;
	locHistory: Array<Coord>;
	checkpointHistory: Array<number>;

	constructor() {
		this.loc = { x: 0, y: 0 };
		this.vx = 0;
		this.vy = 0;
		this.angle = 0;
		this.nextCheckPointId = 0;
		this.locHistory = [];
		this.checkpointHistory = [];
	}

	get lastLoc(): Coord {
		if (this.locHistory.length > 0) {
			return this.locHistory[this.locHistory.length - 1];
		}
		return this.locHistory[0];
	}

	update(
		x: number,
		y: number,
		vx: number,
		vy: number,
		angle: number,
		nextCheckPointId: number
	): void {
		this.loc.x = x;
		this.loc.y = y;
		this.vx = vx;
		this.vy = vy;
		this.angle = angle;
		this.nextCheckPointId = nextCheckPointId;
		this.locHistory.push(this.loc);
		this.checkpointHistory.push(nextCheckPointId);
	}
}

class PlayerPod extends Pod {
	intendedTarget: Coord;
	intendedThrust: number;
	constructor() {
		super();
		this.intendedTarget = { x: 0, y: 0 };
		this.intendedThrust = 0;
	}

	setIntendedTarget(coord: Coord): void {
		this.intendedTarget = coord;
	}

	setIntendedThrust(thrust: number): void {
		this.intendedThrust = thrust;
	}

	logOutput(): void {
		const consoleThrust =
			this.intendedThrust === -1 ? 'BOOST' : this.intendedThrust;
		console.log(
			this.intendedTarget.x +
				' ' +
				this.intendedTarget.y +
				' ' +
				consoleThrust
		);
	}
}

class EnemyPod extends Pod {
	constructor() {
		super();
	}
}

class Game {
	checkpoints: Array<Coord>;
	checkpointCount: number;
	laps: number;
	playerPods: Array<PlayerPod>;
	enemyPods: Array<EnemyPod>;
	turns: number;
	boostLeft: number;

	constructor() {
		this.checkpoints = [];
		this.laps = 0;
		this.checkpointCount = 0;
		const p1 = new PlayerPod();
		const p2 = new PlayerPod();
		const e1 = new EnemyPod();
		const e2 = new EnemyPod();
		this.playerPods = [];
		this.enemyPods = [];
		this.playerPods.push(p1, p2);
		this.enemyPods.push(e1, e2);
		this.turns = 0;
		this.boostLeft = 1;
	}

	updatePods(
		i: number,
		x: number,
		y: number,
		vx: number,
		vy: number,
		angle: number,
		nextCheckPointId: number
	): void {
		if (i < NUM_PODS / 2) {
			this.playerPods[i].update(x, y, vx, vy, angle, nextCheckPointId);
		} else {
			this.enemyPods[i - NUM_PODS / 2].update(
				x,
				y,
				vx,
				vy,
				angle,
				nextCheckPointId
			);
		}
	}

	updateLaps(laps: number): void {
		this.laps = laps;
	}

	updateCheckpointCount(checkpointCount: number): void {
		this.checkpointCount = checkpointCount;
	}

	addCheckpoint(checkpointX: number, checkpointY: number): void {
		this.checkpoints.push({ x: checkpointX, y: checkpointY });
	}

	calculate(): void {
		this.playerPods.forEach((pod) => {
			const targetToAimFor = driftCompensate(
				this.checkpoints[pod.nextCheckPointId],
				pod.loc,
				pod.lastLoc
			);
			pod.setIntendedTarget(targetToAimFor);
			pod.setIntendedThrust(100);
		});
	}

	output(): void {
		this.playerPods.forEach((pod) => {
			return pod.logOutput();
		});
	}
}

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
	// let thrust = 100; // (0 <= thrust <= 100)
	// let recMaxSpeed = MAX_SPEED;
	for (let i = 0; i < NUM_PODS; i++) {
		const [x, y, vx, vy, angle, nextCheckPointId] = readline()
			.split(' ')
			.map((a) => parseInt(a, 10));
		game.updatePods(i, x, y, vx, vy, angle, nextCheckPointId);
	}
	game.calculate();
	game.output();
	// const loc: Coord = { x: x, y: y };
	// const checkPointLoc: Coord = { x: nextX, y: nextY };
	// if (loop === 0) {
	// 	lastLoc = loc;
	// 	lastCheckPointLoc = checkPointLoc;
	// }
	// let targetLoc: Coord = checkPointLoc;
	// const [oppX, oppY] = readline()
	// 	.split(' ')
	// 	.map((a) => parseInt(a, 10));
	// const distanceToEdge = nextDist - CHECK_POINT_SIZE_BUFFER;

	// const speed = distanceBetweenTwoPoints(lastLoc, loc);
	// const driftAngle = findDriftAngle(lastCheckPointLoc, lastLoc, loc);

	/*as distance gets lower, max speed should get lower*/
	// if (distanceToEdge < 2500) {
	// 	recMaxSpeed = (distanceToEdge / 2500) * MAX_SPEED;
	// }
	// if (speed > recMaxSpeed) {
	// 	thrust =
	// 		MIN_THRUST +
	// 		Math.ceil((recMaxSpeed / MAX_SPEED) * (100 - MIN_THRUST));
	// }

	// if (!isWithin(nextAngle, 90)) {
	// 	thrust = MIN_THRUST;
	// }
	/*else if (!(nextAngle === 0) && (nextDist < 300)) {
	    thrust = Math.ceil(25 + (75 - (90/Math.abs(nextAngle))))
	    console.error("Angle: " + nextAngle);
	} else if (!nextAngle === 0) {
	    thrust = Math.ceil(50 + (50 - (90/Math.abs(nextAngle))))
	    console.error("Angle: " + nextAngle);
	}*/

	// if (distanceToEdge > 5000 && boostLeft > 0 && isWithin(nextAngle, 2)) {
	// 	thrust = BOOST;
	// 	boostLeft--;
	// }

	/*Implement way to target perim - 100, not center?
	Calculate velocity, compensate for it*/

	// if (DEVMSG) {
	// 	console.error('Speed:       ' + speed);
	// 	console.error('RecMaxSpeed: ' + recMaxSpeed);
	// 	console.error('Thrust:      ' + thrust);
	// 	console.error('Angle:       ' + nextAngle);
	// 	console.error('DriftAngle:       ' + driftAngle);
	// }
	game.turns++;
}
