
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
    const loadingMsg = addMessage('我先想想，等一下...', true);
    loadingMsg.classList.add('loading-message');

    try {
        const response = await fetch(' https://2c68-2408-8207-6c83-1690-782c-368-b7b9-1daf.ngrok-free.app/chat', {
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