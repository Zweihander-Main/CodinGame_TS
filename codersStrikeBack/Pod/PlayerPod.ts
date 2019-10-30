import Pod from './Pod';

import {
	CHECK_POINT_SIZE_BUFFER,
	CHECK_POINT_RADIUS,
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
	nearestPointOnCircle,
} from '../util';

export default class PlayerPod extends Pod {
	public intendedTarget: Coord;
	public intendedThrust: number;
	public constructor() {
		super();
		this.intendedTarget = { x: 0, y: 0 };
		this.intendedThrust = 0;
	}

	public get speed() {
		return Math.abs(this.vx) + Math.abs(this.vy);
	}

	public setIntendedTarget(coord: Coord): void {
		this.intendedTarget = coord;
	}

	public setIntendedThrust(thrust: number): void {
		this.intendedThrust = thrust;
	}

	public calculateIdealTarget(checkpointCoord: Coord): Coord {
		const nearestPoint = nearestPointOnCircle(
			checkpointCoord,
			CHECK_POINT_RADIUS,
			this.loc
		);
		const idealTarget = driftCompensate(
			nearestPoint,
			this.loc,
			this.lastLoc,
			this.vx,
			this.vy
		);
		const roundedTarget = {
			x: Math.round(idealTarget.x),
			y: Math.round(idealTarget.y),
		};
		return roundedTarget;
	}

	public calculateIdealThrust(
		checkpointCoord: Coord,
		boostLeft: number
	): number {
		let thrust = 100;
		let recMaxSpeed = MAX_SPEED;

		const nextDist = distanceBetweenTwoPoints(checkpointCoord, this.loc);
		const distanceToEdge = nextDist - CHECK_POINT_RADIUS;

		const coordAngle = findAngleBetweenThreePoints(
			{ x: 32000, y: this.loc.y },
			this.loc,
			this.intendedTarget
		);
		const adjustedAngle = this.angle > 180 ? 360 - this.angle : this.angle;
		const nextAngle = Math.floor(adjustedAngle - coordAngle);

		// as distance gets lower, max speed should get lower
		if (distanceToEdge < 2100) {
			recMaxSpeed = (distanceToEdge / 2100) * MAX_SPEED;
		}
		if (this.speed > recMaxSpeed) {
			thrust =
				MIN_THRUST +
				Math.ceil((recMaxSpeed / MAX_SPEED) * (100 - MIN_THRUST));
		}

		if (!isWithin(nextAngle, 90)) {
			thrust = MIN_THRUST;
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
