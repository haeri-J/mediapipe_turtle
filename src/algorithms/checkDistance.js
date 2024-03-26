export function checkDistance(chinLandmark, shoulderMidPoint) {
    if(chinLandmark){
        const chinY = chinLandmark.y;
        const shoulderMidPointY = shoulderMidPoint.y;
        const distance = Math.abs(chinY - shoulderMidPointY)
       
        // 임계치 정하기
        return distance >= 0.5;
    }
}
