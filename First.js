import React from 'react';

const TOKEN = '7161020137:AAGWcZiorGtLq2jnUxynjEbQYYd_eIo4lPo'; // Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token

function apiUrl(methodName, params = null) {
    let query = ''
    if (params) {
      query = '?' + new URLSearchParams(params).toString()
    }
    return `https://api.telegram.org/bot${TOKEN}/${methodName}${query}`
}

async function sendPlainText(chatId, text) {
    var tapiUrl = apiUrl('sendMessage', {chat_id: chatId, text}); // Fixed: Removed 'this.'
    console.log(tapiUrl);
    var returnData = await fetch(tapiUrl);
    console.log(returnData);
    return returnData.json()
}

async function SendHelloMessage() {
    console.log("userName");
    var userName = document.getElementById("user-name").value;
    
    console.log(userName);
    // Send message to Telegram
    var res = await sendPlainText('-1002079280254', `Hello, ${userName}! Welcome to Telegram!`);
}

function First() {
  // JSX code that represents the component's UI
  return (
    <div>
      <h1>Send Telegram Message</h1>
      <input type='text' id='user-name' placeholder='Enter your name'/>
      <button onClick={SendHelloMessage}>Send Welcome Message</button>
    </div>
  );
}

export default First;
