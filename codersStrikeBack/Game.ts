import { NUM_PODS, BOOST } from './constants';
import PlayerPod from './Pod/PlayerPod';
import EnemyPod from './Pod/EnemyPod';

export default class Game {
	public checkpoints: Array<Coord>;
	public checkpointCount: number;
	public laps: number;
	public playerPods: Array<InstanceType<typeof PlayerPod>>;
	public enemyPods: Array<InstanceType<typeof EnemyPod>>;
	public turns: number;
	public boostLeft: number;

	public constructor() {
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

	public updatePods(
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

	public updateLaps(laps: number): void {
		this.laps = laps;
	}

	public updateCheckpointCount(checkpointCount: number): void {
		this.checkpointCount = checkpointCount;
	}

	public addCheckpoint(checkpointX: number, checkpointY: number): void {
		this.checkpoints.push({ x: checkpointX, y: checkpointY });
	}

	public turnStart(): void {
		this.enemyPods.forEach((pod) => {
			const nextCheckPointCoord = this.checkpoints[pod.nextCheckPointId];
			pod.turnStart(nextCheckPointCoord);
		});
		this.playerPods.forEach((pod) => {
			const nextCheckPointCoord = this.checkpoints[pod.nextCheckPointId];
			pod.turnStart(nextCheckPointCoord);
			pod.setIntendedTarget(pod.calculateIdealTarget());
			const thrust = pod.calculateIdealThrust(
				nextCheckPointCoord,
				this.boostLeft
			);
			if (thrust === BOOST) {
				this.boostLeft--;
			}
			pod.setIntendedThrust(thrust);
		});
	}

	public output(): void {
		this.playerPods.forEach((pod) => {
			return pod.logOutput();
		});
	}
}
