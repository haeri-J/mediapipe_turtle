export function checkAngle( chinLandmark, shoulderMidPointZ) {

    const chinZ = chinLandmark.z;
    const distance = Math.abs(chinZ - shoulderMidPointZ);

    return distance <= 0.1;
} 

