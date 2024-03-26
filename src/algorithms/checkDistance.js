export function checkDistance(chinLandmark, shoulderMPointX, shoulderMPointY) {
    if(chinLandmark){

        const chinX = chinLandmark.x;
        const chinY = chinLandmark.y;

        const shoulderMidPointX = shoulderMPointX;
        const shoulderMidPointY = shoulderMPointY;

        const distance = Math.sqrt((chinX - shoulderMidPointX) ** 2 + (chinY - shoulderMidPointY) ** 2);

        console.log("C:" + chinY, "S_x:" + shoulderMidPointX, "S_y:" + shoulderMidPointY, "D:" + distance);

        return distance <= 80;
    }
}
