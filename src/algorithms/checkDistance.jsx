export function checkDistance(chinLandmark, shoulderMidPoint) {
    if(chinLandmark){

        const chinX = chinLandmark.x;
        const chinY = chinLandmark.y;
        //const chinZ = chinLandmark.z;

        const shoulderMidPointX = shoulderMidPoint[0];
        const shoulderMidPointY = shoulderMidPoint[1];
        //const shoulderMidPointZ = shoulderMidPoint[2];

        const distance = Math.sqrt((chinX - shoulderMidPointX) ** 2 + (chinY - shoulderMidPointY) ** 2);

        return distance;

    }
}
