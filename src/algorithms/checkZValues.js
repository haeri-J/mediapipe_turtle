export function checkZValues(noseLandmark, shoulderMidPointZ) {
    if (noseLandmark) {
        const noseZ = noseLandmark.z;

        // Calculate the difference between the z-values of nose and shoulder midpoint
        const distance = Math.abs(noseZ - shoulderMidPointZ);
        return distance >= 0.38;
    } 
}
