import Pod from './Pod';

import { MAX_SPEED, MIN_THRUST, BOOST, SHIELD } from '../constants';

import { driftCompensate, absoluteAngleToDest, isWithin } from '../util';

export default class PlayerPod extends Pod {
	public intendedTarget: Coord;
	public intendedThrust: number;
	public angleToIntendedTarget: number;
	public angleOffsetToIntendedTarget: number;
	public constructor() {
		super();
		this.intendedTarget = { x: 0, y: 0 };
		this.intendedThrust = 0;
	}

	public turnStart(nearestPointCheckPoint): void {
		super.turnStart(nearestPointCheckPoint);
		this.angleToIntendedTarget = absoluteAngleToDest(
			this.loc,
			this.intendedTarget
		);
		this.angleOffsetToIntendedTarget =
			this.angle - this.angleToIntendedTarget;
	}

	public setIntendedTarget(coord: Coord): void {
		this.intendedTarget = coord;
	}

	public setIntendedThrust(thrust: number): void {
		this.intendedThrust = thrust;
	}

	public calculateIdealTarget(): Coord {
		const idealTarget = driftCompensate(
			this.nearestPointCheckPoint,
			this.loc,
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

		// as distance gets lower, max speed should get lower
		if (this.distanceToEdgeCheckPoint < 2100) {
			recMaxSpeed = (this.distanceToEdgeCheckPoint / 2100) * MAX_SPEED;
		}
		console.error(this.speed, recMaxSpeed);
		if (this.speed > recMaxSpeed) {
			thrust =
				MIN_THRUST +
				Math.ceil((recMaxSpeed / MAX_SPEED) * (100 - MIN_THRUST));
		}

		if (!isWithin(this.angleOffsetToIntendedTarget, 90)) {
			thrust = MIN_THRUST;
		} /* else if (nextAngle !== 0 && nextDist < 300) {
			thrust = Math.ceil(25 + (75 - 90 / Math.abs(nextAngle)));
		} else if (nextAngle !== 0) {
			thrust = Math.ceil(50 + (50 - 90 / Math.abs(nextAngle)));
		}*/

		if (
			this.distanceToEdgeCheckPoint > 5000 &&
			boostLeft > 0 &&
			isWithin(this.angleOffsetToIntendedTarget, 2)
		) {
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
