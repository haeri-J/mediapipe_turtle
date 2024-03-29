export function checkZValues(chinLandmark, shoulderMidPoint) {
    if (chinLandmark) {
        const chinZ = chinLandmark.z;
        const shoulderMidPointZ = shoulderMidPoint[2];
        // Calculate the difference between the z-values of nose and shoulder midpoint
        const distance = Math.abs(chinZ - shoulderMidPointZ);

        return distance;
        
    } 
}
 