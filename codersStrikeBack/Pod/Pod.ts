export default class Pod {
	public loc: Coord;
	public vx: number;
	public vy: number;
	public angle: number;
	public nextCheckPointId: number;
	public locHistory: Array<Coord>;
	public checkpointHistory: Array<number>;
	public constructor() {
		this.loc = { x: 0, y: 0 };
		this.vx = 0;
		this.vy = 0;
		this.angle = 0;
		this.nextCheckPointId = 0;
		this.locHistory = []; // .length -1 is current, -2 is last
		this.checkpointHistory = [];
	}

	public get lastLoc(): Coord {
		if (this.locHistory.length > 1) {
			return this.locHistory[this.locHistory.length - 2];
		}
		return this.locHistory[0];
	}

	public update(
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
		this.locHistory.push({ x: x, y: y });
		this.checkpointHistory.push(nextCheckPointId);
	}
}
