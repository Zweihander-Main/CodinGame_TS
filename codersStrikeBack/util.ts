export const distanceBetweenTwoPoints = (
	point1: Coord,
	point2: Coord
): number => {
	return Math.hypot(point2.x - point1.x, point2.y - point1.y);
};

export const isWithin = (toCheck: number, within: number): boolean => {
	return Math.abs(toCheck) < within;
};

/*
 * Calculates the angle ABC
 *
 * A first point, ex: {x: 0, y: 0}
 * C second point
 * B center point
 */
const findAngleBetweenThreePoints = (A: Coord, B: Coord, C: Coord): number => {
	const AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
	const BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
	const AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
	const rad = Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
	return (rad * 180) / Math.PI;
};

export const angleBetweenThreePoints = findAngleBetweenThreePoints;

export const absoluteAngleToDest = (center: Coord, dest: Coord): number => {
	const angle = findAngleBetweenThreePoints(
		{ x: 32000, y: center.y },
		center,
		dest
	);
	// If above, invert
	const adjustedAngle = dest.y < center.y ? 360 - angle : angle;
	return adjustedAngle;
};

export const driftCompensate = (
	dest: Coord,
	cur: Coord,
	vx: number,
	vy: number
): Coord => {
	const target = {} as Coord;
	const nextMove = {} as Coord;
	const destDistance = Math.sqrt(
		(cur.x - dest.x) ** 2 + (cur.y - dest.y) ** 2
	);
	const speedDistance = Math.sqrt(vx ** 2 + vy ** 2);
	nextMove.x = cur.x - (speedDistance * (cur.x - dest.x)) / destDistance;
	nextMove.y = cur.y - (speedDistance * (cur.y - dest.y)) / destDistance;

	const driftX = nextMove.x - (cur.x + vx);
	const driftY = nextMove.y - (cur.y + vy);

	target.x = dest.x + driftX * 2;
	target.y = dest.y + driftY * 2;
	return target;
};

export const nearestPointOnCircle = (
	circleCenter: Coord,
	radius: number,
	givenPoint: Coord
): Coord => {
	const nearestPoint = {} as Coord;
	const vector = {} as Coord;
	vector.x = givenPoint.x - circleCenter.x;
	vector.y = givenPoint.y - circleCenter.y;
	const magV = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
	nearestPoint.x = circleCenter.x + (vector.x / magV) * radius;
	nearestPoint.y = circleCenter.y + (vector.y / magV) * radius;
	return nearestPoint;
};
