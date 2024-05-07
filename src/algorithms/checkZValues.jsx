export function checkZValues(noseLandmark, shoulderMidPoint) {
    if (noseLandmark) {
        const noseZ = noseLandmark.z*-1;
        const shoulderMidPointZ = shoulderMidPoint[2]*-1;
        // Calculate the difference between the z-values of nose and shoulder midpoint
        const distance = Math.abs(noseZ - shoulderMidPointZ);

        return distance;
        
    } 
}
 