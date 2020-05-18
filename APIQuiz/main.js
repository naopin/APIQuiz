const category = document.getElementById('category');
const difficulty = document.getElementById('difficulty');
const title = document.getElementById('title');
const description = document.getElementById('description');
const select = document.getElementById('select');
const startButton = document.getElementById("start");
const btns = document.getElementsByClassName('btn');
const choices = [];
const contentsPush = [];
const questionItems = [];
let contents = [];
let removedQuestion = [];
let count = 1;
let score = 0;

function start() {
    startButton.style.display = "none";
    title.textContent = "取得中";
    description.textContent = "少々お待ちください";
    fetch('https://opentdb.com/api.php?amount=10&type=multiple')
        .then(response => {
            if (response.ok) {
                return response.json();
            } 
        })
        .catch(error => console.error('Error:', error))
        .then(questions => {
            contents = questions.results;
            // console.log(contents);
            // pusshChoices(questions);

            contents.forEach(function (content) {
                const tempAnswers = [];
                tempAnswers.push({ isCorrect: true, text: content.correct_answer });
                tempAnswers.push({ isCorrect: false, text: content.incorrect_answers[0] });
                tempAnswers.push({ isCorrect: false, text: content.incorrect_answers[1] });
                tempAnswers.push({ isCorrect: false, text: content.incorrect_answers[2] });
                questionItems.push(tempAnswers);
            });
            console.log(questionItems);
            // console.log(questionItems); 
            removedQuestion = contents.slice(0, 1);
            // console.log(removedQuestion);
            showQuestion();

        })
        .catch(err => {
            console.error(err);
        });
}

function showQuestion() {
    select.style.display = 'block';
    for (let i = 0; i < removedQuestion.length; i++) {
        title.textContent = "問題" + count;
        category.textContent = "【カテゴリ】" + removedQuestion[i].category;
        difficulty.textContent = "【難易度】" + removedQuestion[i].difficulty;
        description.textContent = removedQuestion[i].question;
        addButton(questionItems[i]);
    }
}
function addButton(qItem) {
    //questionItems[i]をランダム化
    // console.log(qItem);
    let num = qItem.length;
    while (num) {
        let i = Math.floor(Math.random() * num);
        let str = qItem[--num];
        qItem[num] = qItem[i];
        qItem[i] = str;
        // console.log(qItem);
    }

    for (let i = 0; i < qItem.length; i++) {
        btns[i].textContent = qItem[i].text;
        if (qItem[i].isCorrect) {
            btns[i].setAttribute('value', '正解');
        }
        else {
            btns[i].setAttribute('value', '残念');
        }
    }
}
//btnclick時の処理
function pusshChoices(event) {
    if (event.toElement.value === '正解') {
        score++;
    }
    console.log(score);
    console.log(event.toElement.value);
    //contentsの1行目代入
    removedQuestion = [];
    //questionItems,contentsの1行目削除
    questionItems.shift();
    contents.shift();
    count++;
    removedQuestion = contents.slice(0, 1);
    // console.log(removedQuestion);
    showQuestion();
    displaySore();
}
function displaySore() {
    if (contents.length === 0) {
        // console.log(`Score: ${score}`);
        title.textContent = `あなたの正解数は${score}です`;
        description.textContent = "再度チャレンジしたい場合は以下をクリック";
        category.textContent = "";
        difficulty.textContent = "";
        reStart();
    }
}
function reStart() {
    document.getElementById('select').style.display = "none";
    startButton.style.display = "block";
    startButton.textContent = "ホームに戻る";
    count = 1;
    score = 0;
}
