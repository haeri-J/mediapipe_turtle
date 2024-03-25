export function checkDistance(chinLandmark, shoulderMidPointZ) {
    if(chinLandmark){
        const chinY = chinLandmark.y;
        const distance = Math.abs(chinY - shoulderMidPoint)
        console.log("C:" + chinZ, "S:" + shoulderMidPointZ, "D:" + distance);
        // 임계치 정하기
        return distance >= 0.5;
    }
}
