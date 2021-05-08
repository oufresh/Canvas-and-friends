
function calcFrixionForce(radius: number, velocity: number) {
  const fv = -6 * Math.PI * η * radius * velocity;
  return fv;
}

/**
 * Calculate current force resultant: force of engine acceleration and env frixion.
 * @param mass mass of object
 * @param radius radius of the sphere approximating object
 * @param v velocity of object
 * @param trigger accelerator on/off -> true/false
 */
function calcResForce(
  mass: number,
  radius: number,
  velocity: number,
  trigger: boolean
) {
  return;
}
