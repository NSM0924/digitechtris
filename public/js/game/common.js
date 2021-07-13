let ranNum = 0;
let prevNum = null;
let count = 0;
function getRandomIndex(length) {
    while(true){
        ranNum = Math.floor(Math.random()*length);
        if (ranNum == prevNum) {
            count++;
        }else{
            count = 0;
        }
        if (count == 2) {
            count = 0;
            continue;
        }else{
            prevNum = ranNum;
            return ranNum;
        }
    }
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}