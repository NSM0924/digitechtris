const db = firebase.firestore();
let num = 1;
db.collection('ranking').orderBy('score', "desc").get().then((data) => {
    data.forEach((doc) => {
        if(num <= 5){
            console.log(doc.data());
            document.getElementById(`rank${num}`).textContent = doc.data().displayName;
            num++;
        }else{
            return;
        }
    })
})

let rankNum = 1;
db.collection('ranking').orderBy('score', "desc").get().then((data) => {
    data.forEach((doc) => {
            console.log(doc.data());
            document.querySelector('.table2').innerHTML += `<div class="rank">${rankNum}</div>
            <div class="rank"><img src="${doc.data().photoURL}">${doc.data().displayName}</div>
            <div class="rank" style="justify-content: flex-end;">${doc.data().score}</div>
            <div class="rank">${doc.data().level}</div>`;
            rankNum++;
    })
})