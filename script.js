/* // 获取页面元素
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');

// 添加消息到聊天框
function addMessage(message, isBot = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = isBot ? 'bot-message' : 'user-message';
    msgDiv.textContent = (isBot ? '小园丁: ' : '你: ') + message;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // 自动滚动到底部
}

// 发送消息函数
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    
    addMessage(message);
    userInput.value = '';
    
    try {
        // 发送POST请求到后端
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        addMessage(data.reply, true);
    } catch (error) {
        addMessage('出错了，请稍后再试', true);
    }
}


// 在 app.js 的键盘事件监听中补充
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // 新增：显式阻止默认行为
        sendMessage();
    }
});


// 修改事件绑定方式
document.getElementById('sendButton').addEventListener('click', function(e) {
    e.preventDefault();
    sendMessage();
  });
 */

  // 修改后的script.js
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// 返回消息元素的修改后函数
function addMessage(message, isBot = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = isBot ? 'bot-message' : 'user-message';
    msgDiv.textContent = (isBot ? '戴夫: ' : '你: ') + message;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgDiv;
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // 禁用输入控件
    userInput.disabled = true;
    sendButton.disabled = true;

    addMessage(message);
    userInput.value = '';

    // 添加加载中消息
    const loadingMsg = addMessage('服务器正在处理中...', true);
    loadingMsg.classList.add('loading-message');

    try {
        const response = await fetch(' https://cf90-2408-8207-6c83-1690-4d2-142e-ed2a-2128.ngrok-free.app/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        // 替换加载消息内容
        loadingMsg.textContent = '戴夫: ' + data.reply;
        loadingMsg.classList.remove('loading-message');
    } catch (error) {
        loadingMsg.textContent = '戴夫: 服务暂时不可用，请稍后重试';
        loadingMsg.classList.remove('loading-message');
    } finally {
        // 重新启用控件
        userInput.disabled = false;
        sendButton.disabled = false;
        userInput.focus();
    }
}

// 事件监听保持不变
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
});
sendButton.addEventListener('click', sendMessage);