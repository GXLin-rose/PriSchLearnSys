// 页面切换
function goToMath() {
    showPage('math-page');
    // 新增：每次进入口算页面都重置状态
    mathQuestions = null;
    isFirstStart = true;
    mathTime = 0;
    mathPaused = false;
    clearInterval(mathTimer);
    initMathPage();
}
function goToPoetry() {
    showPage('poetry-page');
    initPoetryPage();
}
function backToHome() {
    showPage('home-page');
    // 新增：返回首页时重置口算页面状态
    mathQuestions = null;
    isFirstStart = true;
    mathTime = 0;
    mathPaused = false;
    clearInterval(mathTimer);
    
    // 新增：隐藏口算页面的所有元素
    const mathPage = document.getElementById('math-page');
    if (mathPage) {
        mathPage.innerHTML = '';
        mathPage.classList.remove('has-questions');
    }
    
    // 新增：隐藏诗词页面的所有元素
    const poetryPage = document.getElementById('poetry-page');
    if (poetryPage) {
        poetryPage.innerHTML = '';
    }
    
    // 新增：重置诗词页面状态
    poetryRolling = false;
    poetryCurrent = 0;
    if (poetryRollTimer) {
        clearInterval(poetryRollTimer);
        poetryRollTimer = null;
    }
}
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    if (pageId === 'home-page') {
        document.querySelector('.main-content').style.display = '';
        // 新增：返回首页时显示header、footer和container
        document.querySelector('header').style.display = '';
        document.querySelector('footer').style.display = '';
        document.querySelector('.container').style.display = '';
    } else {
        document.querySelector('.main-content').style.display = 'none';
        // 新增：进入其他页面时隐藏header、footer和container
        document.querySelector('header').style.display = 'none';
        document.querySelector('footer').style.display = 'none';
        document.querySelector('.container').style.display = 'none';
        document.getElementById(pageId).classList.add('active');
    }
}

// 口算题库生成
function generateMathQuestions() {
    const questions = new Set();
    const totalQuestions = 30;
    const easyCount = Math.floor(totalQuestions * 0.2); // 6道简单题
    const mediumCount = Math.floor(totalQuestions * 0.6); // 18道中等题
    const hardCount = totalQuestions - easyCount - mediumCount; // 6道困难题
    
    // 生成简单题目（20以内加减法）
    while (questions.size < easyCount) {
        let a = Math.floor(Math.random() * 20) + 1;
        let b = Math.floor(Math.random() * 20) + 1;
        let op = Math.random() > 0.5 ? '+' : '-';
        if (op === '-' && a < b) [a, b] = [b, a];
        let q = `${a} ${op} ${b}`;
        questions.add(q);
    }
    
    // 生成中等题目（100以内加减法）
    while (questions.size < easyCount + mediumCount) {
        let a = Math.floor(Math.random() * 100);
        let b = Math.floor(Math.random() * 100);
        let op = Math.random() > 0.5 ? '+' : '-';
        if (op === '-' && a < b) [a, b] = [b, a];
        let q = `${a} ${op} ${b}`;
        questions.add(q);
    }
    
    // 生成困难题目（混合运算，如99-40+5）
    while (questions.size < totalQuestions) {
        let a, b, c, q, result;
        
        // 随机选择困难题型
        const type = Math.floor(Math.random() * 4); // 0-3四种类型
        
        do {
            switch (type) {
                case 0: // 一加一减：如 45+30-8
                    a = Math.floor(Math.random() * 60) + 20;  // 20-79
                    b = Math.floor(Math.random() * 40) + 10;  // 10-49
                    c = Math.floor(Math.random() * 20) + 1;   // 1-20
                    q = `${a} + ${b} - ${c}`;
                    result = a + b - c;
                    break;
                    
                case 1: // 两加：如 25+30+15
                    a = Math.floor(Math.random() * 40) + 10;  // 10-49
                    b = Math.floor(Math.random() * 40) + 10;  // 10-49
                    c = Math.floor(Math.random() * 30) + 10;  // 10-39
                    q = `${a} + ${b} + ${c}`;
                    result = a + b + c;
                    break;
                    
                case 2: // 两减：如 80-20-10
                    a = Math.floor(Math.random() * 40) + 60;  // 60-99
                    b = Math.floor(Math.random() * 30) + 10;  // 10-39
                    c = Math.floor(Math.random() * 20) + 5;   // 5-24
                    q = `${a} - ${b} - ${c}`;
                    result = a - b - c;
                    break;
                    
                case 3: // 一减一加：如 99-40+5
                    a = Math.floor(Math.random() * 40) + 60;  // 60-99
                    b = Math.floor(Math.random() * 40) + 10;  // 10-49
                    c = Math.floor(Math.random() * 20) + 1;   // 1-20
                    q = `${a} - ${b} + ${c}`;
                    result = a - b + c;
                    break;
            }
        } while (result > 100 || result < 0);
        
        questions.add(q);
    }
    
    return Array.from(questions);
}

// 修改计算答案的函数，支持混合运算
function calculateAnswer(question) {
    try {
        // 安全地计算表达式
        return eval(question);
    } catch (e) {
        console.error('计算错误:', question, e);
        return 0;
    }
}

// 诗词题库
const poetryList = [
    { title: '静夜思', content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。' },
    { title: '春晓', content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。' },
    { title: '登鹳雀楼', content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。' },
    { title: '悯农', content: '锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。' },
    { title: '咏鹅', content: '鹅鹅鹅，曲项向天歌。白毛浮绿水，红掌拨清波。' },
    { title: '江雪', content: '千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。' },
    { title: '望庐山瀑布', content: '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。' },
    { title: '早发白帝城', content: '朝辞白帝彩云间，千里江陵一日还。两岸猿声啼不住，轻舟已过万重山。' },
    { title: '村居', content: '草长莺飞二月天，拂堤杨柳醉春烟。儿童散学归来早，忙趁东风放纸鸢。' },
    { title: '所见', content: '牧童骑黄牛，歌声振林樾。意欲捕鸣蝉，忽然闭口立。' }
];

// 口算页面逻辑
let mathTimer = null, mathTime = 0, mathPaused = false;
let mathQuestions = null; // 保存当前题目
let isFirstStart = true; // 标记是否是第一次开始
function initMathPage() {
    const mathPage = document.getElementById('math-page');
    mathPage.innerHTML = `
        <button class="back-home-btn" onclick="backToHome()">返回首页</button>
        <div class="timer" id="math-timer">00:00</div>
        <div class="control-buttons">
            <button class="control-btn start-btn" id="math-start-btn">开始</button>
            <button class="control-btn pause-btn" id="math-pause-btn" style="display:none;">暂停</button>
            <button class="control-btn complete-btn" id="math-complete-btn" style="display:none;">完成</button>
        </div>
        <div id="math-questions"></div>
    `;
    document.getElementById('math-timer').innerText = '00:00';
    document.getElementById('math-start-btn').onclick = startMath;
    document.getElementById('math-pause-btn').onclick = pauseMath;
    document.getElementById('math-complete-btn').onclick = completeMath;
    
    // 修改：初始状态显示开始按钮和计时器，隐藏暂停按钮和完成按钮
    document.getElementById('math-timer').style.display = '';
    document.querySelector('.control-buttons').style.display = '';
    document.getElementById('math-start-btn').style.display = '';
    document.getElementById('math-pause-btn').style.display = 'none';
    document.getElementById('math-complete-btn').style.display = 'none';
}
function startMath() {
    document.getElementById('math-start-btn').style.display = 'none';
    document.getElementById('math-pause-btn').style.display = '';
    
    if (!mathTimer) {
        if (isFirstStart) {
            mathQuestions = generateMathQuestions();
            renderMathQuestions();
            isFirstStart = false;
        }
    }
    mathPaused = false;
    mathTimer = setInterval(() => {
        if (!mathPaused) {
            mathTime++;
            document.getElementById('math-timer').innerText = formatTime(mathTime);
        }
    }, 1000);
}
function pauseMath() {
    mathPaused = true;
    document.getElementById('math-pause-btn').style.display = 'none';
    document.getElementById('math-start-btn').style.display = '';
    clearInterval(mathTimer);
    mathTimer = null;
}
function formatTime(sec) {
    let m = String(Math.floor(sec/60)).padStart(2,'0');
    let s = String(sec%60).padStart(2,'0');
    return `${m}:${s}`;
}
function renderMathQuestions() {
    const questions = mathQuestions || generateMathQuestions();
    const grid = document.createElement('div');
    grid.className = 'questions-grid';
    questions.forEach((q, i) => {
        const item = document.createElement('div');
        item.className = 'question-item';
        item.innerHTML = `
            <span class="question-number"><i class="fas fa-star"></i> ${i+1}</span>
            <span class="question-text">${q} = </span>
            <input class="answer-input" type="number" data-answer="${calculateAnswer(q)}" oninput="checkAllFilled()">
        `;
        grid.appendChild(item);
    });
    const container = document.getElementById('math-questions');
    container.innerHTML = '';
    container.appendChild(grid);
    
    // 新增：添加has-questions类来改变布局
    document.getElementById('math-page').classList.add('has-questions');
}
function checkAllFilled() {
    const inputs = document.querySelectorAll('#math-questions .answer-input');
    let allFilled = true;
    inputs.forEach(input => {
        if (input.value === '') allFilled = false;
    });
    document.getElementById('math-complete-btn').style.display = allFilled ? '' : 'none';
}
function completeMath() {
    clearInterval(mathTimer);
    document.getElementById('math-pause-btn').style.display = 'none';
    document.getElementById('math-start-btn').style.display = 'none';
    document.getElementById('math-complete-btn').style.display = 'none';
    let score = 0;
    const inputs = document.querySelectorAll('#math-questions .answer-input');
    inputs.forEach(input => {
        const correct = Number(input.dataset.answer);
        if (Number(input.value) === correct) {
            input.classList.add('correct');
            score++;
        } else {
            input.classList.add('incorrect');
        }
        input.disabled = true;
    });
    showMathResult(score, inputs.length);
}
function showMathResult(score, total) {
    // 创建弹框并直接添加到body
    const modal = document.createElement('div');
    modal.className = 'result-modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="result-content">
            <div class="result-score">${score} / ${total}</div>
            <div class="result-text">${score === total ? '全部答对，太棒了！' : '加油，下次争取全对！'}</div>
            <button class="back-btn" onclick="closeResultModal()">关闭弹框</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeResultModal() {
    const modal = document.querySelector('.result-modal');
    if (modal) {
        modal.remove();
    }
    
    // 在控制按钮位置显示得分信息
    const controlButtons = document.querySelector('.control-buttons');
    if (controlButtons) {
        // 获取得分信息
        const inputs = document.querySelectorAll('#math-questions .answer-input');
        let score = 0;
        inputs.forEach(input => {
            const correct = Number(input.dataset.answer);
            if (Number(input.value) === correct) {
                score++;
            }
        });
        
        controlButtons.innerHTML = `
            <div style="color: #667eea; font-size: 1.2rem; font-weight: bold; padding: 12px 25px;">
                得分：${score}分
            </div>
        `;
    }
}

// 诗词页面逻辑
let poetryRolling = false, poetryRollTimer = null, poetryCurrent = 0;
function initPoetryPage() {
    const poetryPage = document.getElementById('poetry-page');
    poetryPage.innerHTML = `
        <button class="back-home-btn" onclick="backToHome()">返回首页</button>
        <div class="poetry-controls">
            <button class="poetry-btn start-roll-btn" id="poetry-start-btn">开始随机抽查</button>
            <button class="poetry-btn pause-roll-btn" id="poetry-pause-btn" style="display:none;">暂停</button>
            <button class="poetry-btn view-answer-btn" id="poetry-view-btn" style="display:none;">查看诗词答案</button>
        </div>
        <div class="poetry-display"><span class="poetry-title" id="poetry-title">——</span></div>
        <div class="poetry-modal" id="poetry-modal" style="display:none;">
            <div class="poetry-content">
                <div class="poetry-full-title" id="poetry-full-title"></div>
                <div class="poetry-full-content" id="poetry-full-content"></div>
                <button class="close-modal-btn" onclick="closePoetryModal()">关闭弹窗</button>
            </div>
        </div>
    `;
    document.getElementById('poetry-start-btn').onclick = startPoetryRoll;
    document.getElementById('poetry-pause-btn').onclick = pausePoetryRoll;
    document.getElementById('poetry-view-btn').onclick = showPoetryModal;
}
function startPoetryRoll() {
    poetryRolling = true;
    document.getElementById('poetry-start-btn').style.display = 'none';
    document.getElementById('poetry-pause-btn').style.display = '';
    document.getElementById('poetry-view-btn').style.display = 'none';
    poetryRollTimer = setInterval(() => {
        poetryCurrent = Math.floor(Math.random() * poetryList.length);
        document.getElementById('poetry-title').innerText = poetryList[poetryCurrent].title;
    }, 80);
}
function pausePoetryRoll() {
    poetryRolling = false;
    clearInterval(poetryRollTimer);
    document.getElementById('poetry-pause-btn').style.display = 'none';
    document.getElementById('poetry-start-btn').style.display = '';
    document.getElementById('poetry-view-btn').style.display = '';
}
function showPoetryModal() {
    if (!poetryRolling) {
        document.getElementById('poetry-modal').style.display = '';
        document.getElementById('poetry-full-title').innerText = poetryList[poetryCurrent].title;
        document.getElementById('poetry-full-content').innerText = poetryList[poetryCurrent].content;
    }
}
function closePoetryModal() {
    document.getElementById('poetry-modal').style.display = 'none';
}

// 初始化页面容器
window.onload = function() {
    // 创建页面容器
    const mathPage = document.createElement('div');
    mathPage.id = 'math-page';
    mathPage.className = 'page math-page';
    document.body.appendChild(mathPage);
    const poetryPage = document.createElement('div');
    poetryPage.id = 'poetry-page';
    poetryPage.className = 'page poetry-page';
    document.body.appendChild(poetryPage);
}; 