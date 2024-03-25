export function checkDistance(chinLandmark, shoulderMidPoint) {
    if(chinLandmark){
        const chinY = chinLandmark.y;
        const shoulderMidPointY = chinLandmark.y;
        const distance = Math.abs(chinY - shoulderMidPointY)
        console.log("C:" + chinY, "S:" + shoulderMidPointY, "D:" + distance);
        // 임계치 정하기
        return distance >= 0.5;
    }
}
