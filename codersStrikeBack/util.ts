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
export const findAngleBetweenThreePoints = (
	A: Coord,
	B: Coord,
	C: Coord
): number => {
	const AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
	const BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
	const AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
	const rad = Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
	return (rad * 180) / Math.PI;
};

export const driftCompensate = (
	Dest: Coord,
	Cur: Coord,
	Prev: Coord
): Coord => {
	const target = {} as Coord;
	target.x = Dest.x - (Cur.x - Prev.x);
	target.y = Dest.y - (Cur.y - Prev.y);
	return target;
};
