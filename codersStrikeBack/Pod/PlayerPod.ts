import Pod from './Pod';

import {
	CHECK_POINT_SIZE_BUFFER,
	MAX_SPEED,
	MIN_THRUST,
	BOOST,
	SHIELD,
} from '../constants';

import {
	driftCompensate,
	distanceBetweenTwoPoints,
	findAngleBetweenThreePoints,
	isWithin,
} from '../util';

export default class PlayerPod extends Pod {
	public intendedTarget: Coord;
	public intendedThrust: number;
	public constructor() {
		super();
		this.intendedTarget = { x: 0, y: 0 };
		this.intendedThrust = 0;
	}

	public setIntendedTarget(coord: Coord): void {
		this.intendedTarget = coord;
	}

	public setIntendedThrust(thrust: number): void {
		this.intendedThrust = thrust;
	}

	public calculateIdealTarget(checkpointCoord: Coord): Coord {
		const idealTarget = driftCompensate(
			checkpointCoord,
			this.loc,
			this.lastLoc
		);
		return idealTarget;
	}

	public calculateIdealThrust(
		checkpointCoord: Coord,
		boostLeft: number
	): number {
		let thrust = 100;
		let recMaxSpeed = MAX_SPEED;
		const nextDist = distanceBetweenTwoPoints(checkpointCoord, this.loc);
		const coordAngle = findAngleBetweenThreePoints(
			{ x: 32000, y: this.loc.y },
			this.loc,
			checkpointCoord
		);
		const adjustedAngle = this.angle > 180 ? 360 - this.angle : this.angle;
		const nextAngle = Math.floor(adjustedAngle - coordAngle);

		const distanceToEdge = nextDist - CHECK_POINT_SIZE_BUFFER;
		const speed = Math.abs(this.vx) + Math.abs(this.vy); // distanceBetweenTwoPoints(this.lastLoc, this.loc);

		// as distance gets lower, max speed should get lower
		if (distanceToEdge < 2500) {
			recMaxSpeed = (distanceToEdge / 2500) * MAX_SPEED;
		}
		if (speed > recMaxSpeed) {
			thrust =
				MIN_THRUST +
				Math.ceil((recMaxSpeed / MAX_SPEED) * (100 - MIN_THRUST));
		}

		if (!isWithin(nextAngle, 90)) {
			thrust = 42;
		} /* else if (nextAngle !== 0 && nextDist < 300) {
			thrust = Math.ceil(25 + (75 - 90 / Math.abs(nextAngle)));
		} else if (nextAngle !== 0) {
			thrust = Math.ceil(50 + (50 - 90 / Math.abs(nextAngle)));
		}*/

		if (distanceToEdge > 5000 && boostLeft > 0 && isWithin(nextAngle, 2)) {
			thrust = BOOST;
			boostLeft--;
		}
		return thrust;
	}

	public logOutput(): void {
		const consoleThrust =
			this.intendedThrust === BOOST
				? 'BOOST'
				: this.intendedThrust === SHIELD
				? 'SHIELD'
				: this.intendedThrust;
		console.log(
			this.intendedTarget.x +
				' ' +
				this.intendedTarget.y +
				' ' +
				consoleThrust
		);
	}

	public debug(): void {
		console.error();
	}
}
