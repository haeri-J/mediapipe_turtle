export function checkAngle(chinLandmark, LShoulder, shoulderMidPoint) {

    if(chinLandmark){
        // 턱 2차원 값
        const chinX = chinLandmark.x;
        const chinY = chinLandmark.y;

        // 어깨 중간 점 2차원 값
        const shoulderMidPointX = shoulderMidPoint[0];
        const shoulderMidPointY = shoulderMidPoint[1];

        // 왼쪽 어깨 랜드마크 2차원 값
        const leftShoulder = LShoulder;

        // 벡터 구하기
        const vec1_x = leftShoulder.x - shoulderMidPointX;
        const vec1_y = leftShoulder.y - shoulderMidPointY;
        const vec2_x = chinX - shoulderMidPointX;
        const vec2_y = chinY - shoulderMidPointY;

        const dot_product = vec1_x * vec2_x + vec1_y * vec2_y;
        const vec1_length = Math.sqrt(vec1_x ** 2 + vec1_y ** 2);
        const vec2_length = Math.sqrt(vec2_x ** 2 + vec2_y ** 2);

        const cos_theta = dot_product / (vec1_length * vec2_length);
        const angle_rad = Math.acos(cos_theta);
        const angle_deg = (angle_rad * 180) / Math.PI;

        return angle_deg;
    }
} 

