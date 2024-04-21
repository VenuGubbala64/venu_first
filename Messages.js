/**
 * https://github.com/cvzi/telegram-bot-cloudflare
 */

const TOKEN = '5961621807:AAEKrsNqOhdgaTNqcfJiYRLUgfAt3KP8CCI' // Get it from @BotFather https://core.telegram.org/bots#6-botfather
//const TOKEN ="5408768997:AAH0FY9UHd34SoiS__WUBiScbxiEPvqmptk";
const WEBHOOK = '/endpoint'
const SECRET = 'QUEVEDO_BZRP_Music_Sessions_52' // A-Z, a-z, 0-9, _ and -

/**
 * Wait for requests to the worker
 */
addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  let absoluteUrl = event.request.url;
  if (url.pathname === WEBHOOK) {
    event.respondWith(handleWebhook(event))
  } else if (url.pathname === '/registerWebhook') {
    event.respondWith(registerWebhook(event, url, WEBHOOK, SECRET))
  } else if (url.pathname === '/unRegisterWebhook') {
    event.respondWith(unRegisterWebhook(event))
  }
  else if (absoluteUrl.toLowerCase().indexOf("/api/sendtelegramwithbutton") != -1) {
    try {
      event.respondWith(handleTelegramRequest(event.request, event))

    } catch (e2) {
      console.log(e2);
      return Response.json(e2);
    }
  }
    else if (absoluteUrl.toLowerCase().indexOf("/api/removeuserfromchannel") != -1) {
    try {
      event.respondWith(handleRemoveUserFromGroup(event.request, event))

    } catch (e2) {
      console.log(e2);
      return Response.json(e2);
    }
  }
  else if (absoluteUrl.toLowerCase().indexOf("/api/addusertochannel") != -1) {
    try {
      event.respondWith(handleAddUserToGroup(event.request, event))

    } catch (e2) {
      console.log(e2);
      return Response.json(e2);
    }
  }
  else if (absoluteUrl.toLowerCase().indexOf("/api/forwardmessage") != -1) {
    try {
      event.respondWith(handleForwardMessage(event.request, event))

    } catch (e2) {
      console.log(e2);
      return Response.json(e2);
    }
  }
  //handleAddUserToGroup
  else if (absoluteUrl.toLowerCase().indexOf("/api/sendgroupedimages") != -1) {
    try {
      event.respondWith(handleGroupRequest(event.request, event))

    } catch (e2) {
      console.log(e2);
      return Response.json(e2);
    }
  }
  else if (absoluteUrl.toLowerCase().indexOf("/api/sendtelegramreply") != -1) {
    try {
      event.respondWith(handleTelegramReplyRequest(event.request, event))

    } catch (e2) {
      console.log(e2);
      return Response.json(e2);
    }
  }
  //
  else if (url.pathname === '/sendtelegramwithbutton') {


  }
  else if (url.pathname === '/test') {

    // event.respondWith(sendPlainText(-1001795465273,'T1 Support'));
    //1691357343 //1897428298
    //event.respondWith(sendTwoButtons(-1001691357343));
    event.respondWith(sendTwoButtons(1691357343));

    //sendTwoButtons

    // event.respondWith(new Response(xx.json()))
  } else {
    event.respondWith(new Response('No handler for this request'))
  }
})


async function  removeUserFromGroup(channelId,userId) {
  var finalCId = "-100" + channelId;
  var response = await banChatMember(finalCId,userId);
  return response;
  
}


async function  addUserToGroup(channelId,userId) {
  var finalCId = "-100" + channelId;
  var response = await addChatMember(finalCId,userId);
  return response;
  
}

//addChatMember

async function banChatMember(chatId, userId) {
  var url = apiUrl('banChatMember', {
    chat_id: chatId,
    user_id:userId,
   
  });
  console.log(url);
  console.log(url);
  console.log("Remove Member From Chat");
  return (await fetch(url)).json()
}

async function addChatMember(chatId, userId) {
  var url = apiUrl('channels.inviteToChannel', {
    channel_id: chatId,
    user_id:userId,
   
  });
  console.log(url);
  console.log(url);
  console.log("addChatMember From Chat");
  return (await fetch(url)).json()
}


async function handleRemoveUserFromGroup(request, event) {
  var responseObj = null;
  const postData = await event.request.json();
  //console.log(postData);
  var userId = postData.userId;
  var channelId = postData.channelId;
  var data = await removeUserFromGroup(channelId, userId);
  responseObj = getSuccessResponse(data);
  return responseObj;

}




async function handleAddUserToGroup(request, event) {
  var responseObj = null;
  const postData = await event.request.json();
  //console.log(postData);
  var userId = postData.userId;
  var channelId = postData.channelId;
  var data = await addUserToGroup(channelId, userId);
  responseObj = getSuccessResponse(data);
  return responseObj;

}

//addUserToGroup

async function handleTelegramReplyRequest(request, event) {
  var responseObj = null;

  const postData = await event.request.json();
  //console.log(postData);
  var messageId = postData.messageId;
  var channelId = postData.channelId;
  var message = postData.message;
  var url = postData.url;

  var data = {};
  if(url && url.indexOf('.pdf') > -1){
    
     data = await sendTelegramMessageReplyPDF(messageId, channelId, message,url);

  }else{
    var data = await sendTelegramMessageReply(messageId, channelId, message);
  }
 



  responseObj = getSuccessResponse(data);
  return responseObj;

}

async function handleTelegramRequest(request, event) {
  var responseObj = null;

  // console.log(request.body);

  const postData = await event.request.json();
  //console.log(postData);
  var pwd = postData.pwd;
  var chatId = postData.cid;
  var message = postData.message;
  var url = postData.url;
  var buttonText = postData.parameters;
  var hideOnReply = postData.btnHide;

  try {
    if (pwd != "success9*") {
      responseObj = getErrorResponse("Unauthorized access", 403, {});
      return responseObj;
    }
    if (!chatId) {
      responseObj = getErrorResponse("Provide Valid ChatId", 403, {});
      return responseObj;
    }

    var data = await sendTelegramMessageWithButtons(chatId, message, buttonText, url, hideOnReply);


    responseObj = getSuccessResponse(data);
    return responseObj;
  }
  catch (e) {
    responseObj = getErrorResponse("Error in Handle", 500, e);
    console.log(e);
    return responseObj;

  }
}


async function handleForwardMessage(request, event) {

  try {
    var responseObj = null;
    const postData = await event.request.json();
    //console.log(postData);
    var pwd = postData.pwd;
    var sourceChannelId = postData.scid;
    var messageId = postData.mid;
    var destinationChannelId = postData.dcid;

    var data =  await sendTelegramForward(messageId,destinationChannelId,sourceChannelId);
    responseObj = getSuccessResponse(data);
  return responseObj;
    
  } catch (e) {
    console.log(e);
  }
  //forwardmessage
}

async function handleGroupRequest(request, event) {
  var responseObj = null;

  console.log("handleGroupRequest");

  console.log(event.request)

  const postData = await event.request.json();
  console.log(JSON.stringify(postData));
  var pwd = postData.pwd;
  var chatId = postData.cid;
  var message = postData.message;
  var url = postData.url;
  var buttonText = postData.parameters;
  var hideOnReply = postData.btnHide;

  console.log("Before")

  try {
    if (pwd != "success9*") {
      responseObj = getErrorResponse("Unauthorized access", 403, {});
      return responseObj;
    }
    if (!chatId) {
      responseObj = getErrorResponse("Provide Valid ChatId", 403, {});
      return responseObj;
    }

    var data = await sendTelegramGroupMedia(chatId, message, buttonText, url, hideOnReply);


    responseObj = getSuccessResponse(data);
    return responseObj;
  }
  catch (e) {
    responseObj = getErrorResponse("Error in Handle", 500, e);
    console.log(e);
    return responseObj;

  }
}

function sendTwoButtons(chatId) {



  var telegramButtons = ["All fee entered nothing pending{#}tick", "Nope received fee, enjoying it{#}cross"];
  var message = "*Entered all fee received into Pinnacle?*\n\n" +
    "*Shared fee receipts with parents?*\n\n" + "Gopi . Potharlanka, \r\nNCC - Finance Officer.\r\nPinnacle Blooms Network,\r\n#1 Autism Therapy Centres Network ❤";
  var imageURL = "https://images.pinnacleblooms.org/images/ProfileImages/1752.jpg";
  return sendTelegramMessageWithButtons(chatId, message, telegramButtons, imageURL, true);

  //return sendInlineButtonsMarkUp(chatId, message, buttons)
}

function getErrorResponse(msg, errorCode, errObj) {
  try {
    console.log("Error method");
    console.log(errObj);
    var customObj = {};
    customObj.Status = "ERROR";
    customObj.Message = msg;
    customObj.ExceptionMessage = msg;
    customObj.ExceptionType = errObj.ExceptionType;
    customObj.StackStrace = errObj.message + " : " + errObj.stack;

    let response = new Response(JSON.stringify(customObj), { status: errorCode });
    response.headers.set('Cache-Control', 'no-store, max-age=' + 0);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', '*');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    response.headers.set('IH-RESPONSETIME', new Date());




    return response;
  } catch (err) {
    console.log("Error in getErrorResponse : " + err);
  }
}

function getSuccessResponse(data, cacheTime) {
  try {
    cacheTime = cacheTime || 0;
    let response = new Response(JSON.stringify(data), { status: 200 });
    response.headers.set('Cache-Control', 'no-store, max-age=' + cacheTime);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', '*');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    response.headers.set('PBN-RESPONSETIME', new Date());


    return response;
  } catch (err) {
    console.log("Error in getSuccessResponse : " + err);
  }
}

/**
 * Handle requests to WEBHOOK
 * https://core.telegram.org/bots/api#update
 */
async function handleWebhook(event) {
  // Check secret
  if (event.request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== SECRET) {
    return new Response('Unauthorized', { status: 403 })
  }

  // Read request body synchronously
  const update = await event.request.json()
  // Deal with response asynchronously
  event.waitUntil(onUpdate(update))

  return new Response('Ok')
}

/**
 * Handle incoming Update
 * supports messages and callback queries (inline button presses)
 * https://core.telegram.org/bots/api#update
 */
async function onUpdate(update) {
  if ('message' in update) {
    await onMessage(update.message)
  }
  if ('callback_query' in update) {
    await onCallbackQuery(update.callback_query)
  }
}

/**
 * Set webhook to this worker's url
 * https://core.telegram.org/bots/api#setwebhook
 */
async function registerWebhook(event, requestUrl, suffix, secret) {
  // https://core.telegram.org/bots/api#setwebhook
  const webhookUrl = `${requestUrl.protocol}//${requestUrl.hostname}${suffix}`
  const r = await (await fetch(apiUrl('setWebhook', { url: webhookUrl, secret_token: secret }))).json()
  return new Response('ok' in r && r.ok ? 'Ok' : JSON.stringify(r, null, 2))
}

/**
 * Remove webhook
 * https://core.telegram.org/bots/api#setwebhook
 */
async function unRegisterWebhook(event) {
  const r = await (await fetch(apiUrl('setWebhook', { url: '' }))).json()
  return new Response('ok' in r && r.ok ? 'Ok' : JSON.stringify(r, null, 2))
}

/**
 * Return url to telegram api, optionally with parameters added
 */
function apiUrl(methodName, params = null) {
  let query = ''
  if (params) {
    query = '?' + new URLSearchParams(params).toString()
  }
  return `https://api.telegram.org/bot${TOKEN}/${methodName}${query}`
}

/**
 * Send plain text message
 * https://core.telegram.org/bots/api#sendmessage
 */
async function sendPlainText(chatId, text) {
  return (await fetch(apiUrl('sendMessage', {
    chat_id: chatId,
    text
  }))).json()
}

/**
 * Send text message formatted with MarkdownV2-style
 * Keep in mind that any markdown characters _*[]()~`>#+-=|{}.! that
 * are not part of your formatting must be escaped. Incorrectly escaped
 * messages will not be sent. See escapeMarkdown()
 * https://core.telegram.org/bots/api#sendmessage
 */
async function sendMarkdownV2Text(chatId, text) {
  return (await fetch(apiUrl('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'MarkdownV2'
  }))).json()
}

/**
 * Send text message formatted with MarkdownV2-style
 * Keep in mind that any markdown characters _*[]()~`>#+-=|{}.! that
 * are not part of your formatting must be escaped. Incorrectly escaped
 * messages will not be sent. See escapeMarkdown()
 * https://core.telegram.org/bots/api#sendmessage
 */
async function sendMarkdownText(chatId, text) {
  return (await fetch(apiUrl('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown'
  }))).json()
}


async function sendMarkdownReplyText(messageId,chatId, text) {
  return (await fetch(apiUrl('sendMessage', {
    chat_id: chatId,
    reply_to_message_id:messageId,
    text,
    parse_mode: 'Markdown'
  }))).json()
}

async function sendForwardMessageText(messageId,chatId, sChatId) {
  return (await fetch(apiUrl('forwardMessage', {
    chat_id: chatId,
    from_chat_id: sChatId,
    message_id: messageId,
   // parse_mode: 'Markdown'
  }))).json()
}

async function sendTelegramReplyPDF(messageId, chatId, text, imageURL) {
  var url = apiUrl('sendDocument', {
    chat_id: chatId,
    reply_to_message_id:messageId,
    parse_mode: 'Markdown',
    document: imageURL,
    caption:text
  });
  console.log(imageURL);
  console.log(url);
  console.log("SEND AUDIO TELEGRAM");
  return (await fetch(url)).json()
}


/**
 * Escape string for use in MarkdownV2-style text
 * if `except` is provided, it should be a string of characters to not escape
 * https://core.telegram.org/bots/api#markdownv2-style
 */
function escapeMarkdown(str, except = '') {
  const all = '_*[]()~`>#+-=|{}.!\\'.split('').filter(c => !except.includes(c))
  const regExSpecial = '^$*+?.()|{}[]\\'
  const regEx = new RegExp('[' + all.map(c => (regExSpecial.includes(c) ? '\\' + c : c)).join('') + ']', 'gim')
  return str.replace(regEx, '\\$&')
}

/**
 * Send a message with a single button
 * `button` must be an button-object like `{ text: 'Button', callback_data: 'data'}`
 * https://core.telegram.org/bots/api#sendmessage
 */
async function sendInlineButton(chatId, text, button) {
  return sendInlineButtonRow(chatId, text, [button])
}

/**
 * Send a message with buttons, `buttonRow` must be an array of button objects
 * https://core.telegram.org/bots/api#sendmessage
 */
async function sendInlineButtonRow(chatId, text, buttonRow) {
  return sendInlineButtons(chatId, text, [buttonRow])
}

/**
 * Send a message with buttons, `buttons` must be an array of arrays of button objects
 * https://core.telegram.org/bots/api#sendmessage
 */
async function sendInlineButtons(chatId, text, buttons) {
  return (await fetch(apiUrl('sendMessage', {
    chat_id: chatId,
    reply_markup: JSON.stringify({
      inline_keyboard: buttons
    }),
    text
  }))).json()
}



/**
 * Send a message with buttons, `buttons` must be an array of arrays of button objects
 * https://core.telegram.org/bots/api#sendmessage
 */
async function sendInlineButtonsMarkUp(chatId, text, buttons) {
  var url = apiUrl('sendMessage', {
    chat_id: chatId,
    parse_mode: 'Markdown',
    reply_markup: JSON.stringify({
      inline_keyboard: buttons
    }),
    text
  });
  console.log(url);
  //alert(url);
  return (await fetch(url)).json()
}


/**
 * Send a message with buttons, `buttons` must be an array of arrays of button objects
 * https://core.telegram.org/bots/api#sendmessage
 */
async function sendInlineButtonsMarkUpWithImage(chatId, text, buttons, imageURL) {
  var url = apiUrl('sendPhoto', {
    chat_id: chatId,
    parse_mode: 'Markdown',
    photo: imageURL,
    reply_markup: JSON.stringify({
      inline_keyboard: buttons
    }),
    caption: text
  });
  console.log(imageURL);
  console.log(url);
  return (await fetch(url)).json()
}

async function sendGroupOfImages(chatId, text, buttons, imageURL) {
  var url = apiUrl('sendMediaGroup', {
    chat_id: chatId,
    parse_mode: 'Markdown',
    media: JSON.stringify(imageURL),
    reply_markup: JSON.stringify({
      inline_keyboard: buttons
    }),
    caption: text
  });
  console.log(imageURL);
  console.log(url);
  return (await fetch(url)).json()
}

async function sendInlineButtonsMarkUpWithImageOnly(chatId, text, buttons, imageURL) {
  var url = apiUrl('sendPhoto', {
    chat_id: chatId,
    parse_mode: 'Markdown',
    photo: imageURL,
    reply_markup: JSON.stringify({
      inline_keyboard: buttons
    })
  });
  console.log(imageURL);
  console.log(url);
  return (await fetch(url)).json()
}

async function sendInlineButtonsMarkUpWithVideo(chatId,text ,buttons, imageURL) {
  var url = apiUrl('sendVideo', {
    chat_id: chatId,
    parse_mode: 'Markdown',
    video: imageURL,
    reply_markup: JSON.stringify({
      inline_keyboard: buttons,
    })
  });
  console.log(imageURL);
  console.log(url);
  return (await fetch(url)).json()
}

async function sendTelegramAudioFile(chatId, text, buttons, imageURL) {
  var url = apiUrl('sendAudio', {
    chat_id: chatId,
    parse_mode: 'Markdown',
    audio: imageURL,
    reply_markup: JSON.stringify({
      inline_keyboard: buttons,
    }),
    caption: text?text:""
  });
  console.log(imageURL);
  console.log(url);
  console.log("SEND AUDIO TELEGRAM");
  return (await fetch(url)).json()
}

async function sendTelegramPdfFile(chatId, text, buttons, imageURL) {
  var url = apiUrl('sendAudio', {
    chat_id: chatId,
    parse_mode: 'Markdown',
    audio: imageURL,
    reply_markup: JSON.stringify({
      inline_keyboard: buttons,
    }),
    caption: text?text:""
  });
  console.log(imageURL);
  console.log(url);
  console.log("SEND AUDIO TELEGRAM");
  return (await fetch(url)).json()
}

/**
 * Answer callback query (inline button press)
 * This stops the loading indicator on the button and optionally shows a message
 * https://core.telegram.org/bots/api#sendmessage
 */
async function answerCallbackQuery(callbackQueryId, text = null) {
  const data = {
    callback_query_id: callbackQueryId
  }
  if (text) {
    data.text = text
  }
  return (await fetch(apiUrl('answerCallbackQuery', data))).json()
}

//editMessageText
/**
 * Send a message with buttons, `buttons` must be an array of arrays of button objects
 * https://core.telegram.org/bots/api#sendmessage
 */
async function editMessageTextOnResponse(chatId, messageId, text, buttons, entities) {

  if (buttons) {
    return (await fetch(apiUrl('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      reply_markup: buttons,
      entities: entities,
      text
    }))).json()
  }
  else {
    return (await fetch(apiUrl('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      entities: entities,
      text
    }))).json()
  }

}

//editMessageText
/**
 * Send a message with buttons, `buttons` must be an array of arrays of button objects
 * https://core.telegram.org/bots/api#sendmessage
 */
async function editMessageCaptionOnResponse(chatId, messageId, caption, buttons, entities) {

  if (buttons) {
    return (await fetch(apiUrl('editMessageCaption', {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      reply_markup: buttons,
      entities: entities,
      caption
    }))).json()
  }
  else {
    return (await fetch(apiUrl('editMessageCaption', {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      entities: entities,
      caption
    }))).json()
  }

}

const symbolsDict = {
  "i will complete today": "✅",
  "i don't care": "❌",
  "i need time / support": "⏱",
  "i don't understand this": "⏱",
  "tick": "✅",
  "report": "✅",
  "time": "⏱",
  "cross": "❌"
};

/**
 * Handle incoming callback_query (inline button press)
 * https://core.telegram.org/bots/api#message
 */
async function onCallbackQuery(callbackQuery) {

  var messageToAdd = "";
  var dataSplits = callbackQuery.data.split('{#}');
  var btnText = dataSplits[0];
  var dt = new Date();
  dt.setHours(dt.getHours() + 5)
  dt.setMinutes(dt.getMinutes() + 30)
  var responseTime = dt.toLocaleTimeString();// " time calc"; //DateTime.Now.ToString("hh:mm tt");
  var btnhide = dataSplits.length > 1 ? dataSplits[1].toLowerCase() == "true" ? true : false : false;
  var iconText = dataSplits.length > 2 ? dataSplits[2].toLowerCase() : btnText.ToLower();


  var symbol = "";
  try {
    symbol = symbolsDict[iconText];
  }
  catch (Exception) {


  }

  messageToAdd += symbol + " *" + btnText + "* - " + callbackQuery.from.first_name + " @ " + responseTime;

  // await sendMarkdownText(callbackQuery.message.chat.id,callbackQuery.message.chat.id)
  //    await sendMarkdownText(callbackQuery.message.chat.id,JSON.stringify(callbackQuery.message.entities))
  //    await sendMarkdownText(callbackQuery.message.chat.id,callbackQuery.message.entities.length)
  //    await sendMarkdownText(callbackQuery.message.chat.id,JSON.stringify(callbackQuery.message.message_entity))

  var messageToSendBack = callbackQuery.message.text ? callbackQuery.message.text + "\n\n" + messageToAdd : callbackQuery.message.caption + "\n\n" + messageToAdd;

  var isImage = callbackQuery.message.caption ? true : false;
  var isExpenseReport  = (btnText && btnText.toLowerCase().indexOf("report wrong doing") > -1) ? true : false;

  var btn_data = btnhide ? "" : JSON.stringify(callbackQuery.message.reply_markup);
  var entities = JSON.stringify(callbackQuery.message.entities); 
     var userObj = {};

    // await sendMessageToGroupOnResponse("-1001795465273", btnText + "-"+ callbackQuery.from.first_name,[]);

  if (callbackQuery.message.chat.id == -1001795465273) {
 if(isExpenseReport){
        //sendMessageToGroupOnResponse
        var callbackQueryfrom = callbackQuery.from;
     userObj = {};
        userObj.TelegramId = callbackQueryfrom.id;
        userObj.Name = callbackQueryfrom.first_name + " " + (callbackQueryfrom.last_name ? callbackQueryfrom.last_name : "");
      //  var finalCId = "-100" + channelId;
      //var from = JSON.stringify(callbackQuery.from);
      var date = new Date();
      var day = date.getDate();
      var month = date.toLocaleDateString('default',{month:'short'});
      var formattedDate = day +'/' + month.toUpperCase();
      var messageToReport = callbackQuery.message.text ? callbackQuery.message.text  : callbackQuery.message.caption;
      var messageToSend = formattedDate + " "+userObj.Name + "\n\nReporting Wrong Expenses." + "\n\n" + messageToReport;
       await sendMessageToGroupOnResponse("-1002019208727",  messageToSend,[]);
    }else{
      var data = await editMessageTextOnResponse(callbackQuery.message.chat.id, callbackQuery.message.message_id, messageToSendBack, btn_data, entities)
      if (isImage) {
        var data = await editMessageCaptionOnResponse(callbackQuery.message.chat.id, callbackQuery.message.message_id, messageToSendBack, btn_data, entities)
  
      }
    }
   

  }
  else {
    ///IF EXPENSE
    if(isExpenseReport){
      var callbackQueryfrom = callbackQuery.from;
      userObj = {};
         userObj.TelegramId = callbackQueryfrom.id;
         userObj.Name = callbackQueryfrom.first_name + " " + (callbackQueryfrom.last_name ? callbackQueryfrom.last_name : "");
       //  var finalCId = "-100" + channelId;
       //var from = JSON.stringify(callbackQuery.from);
       var date = new Date();
       var day = date.getDate();
       var month = date.toLocaleDateString('default',{month:'short'});
       var formattedDate = day +'/' + month.toLowerCase();
       var messageToReport = callbackQuery.message.text ? callbackQuery.message.text  : callbackQuery.message.caption;
       var messageToSend = formattedDate + " "+userObj.Name + "\n\nReporting Wrong Expenses." + "\n\n" + messageToReport;
        await sendMessageToGroupOnResponse("-1002019208727",  messageToSend,[]);
       
    }
    else{
      if (isImage) {
        var data = await editMessageCaptionOnResponse(callbackQuery.message.chat.id, callbackQuery.message.message_id, messageToSendBack, btn_data, entities)
  
      }
      else {
        var data = await editMessageTextOnResponse(callbackQuery.message.chat.id, callbackQuery.message.message_id, messageToSendBack, btn_data, entities)
  
      }
    }
    

  }



  await PostBackData(callbackQuery.message, callbackQuery.from, messageToAdd, iconText)
  return answerCallbackQuery(callbackQuery.id, 'Button press acknowledged!!!')


}

async function sendMessageToGroupOnResponse(finalCId,message,buttons){

  try{
    

    var response = await sendInlineButtonsMarkUp(finalCId, message, buttons);
  }
  catch(e){
    console.log(e)
  }

}

async function PostBackData(message, callbackQueryfrom, messageToAdd, text) {
  try {
    var userObj = {}
    userObj.MessageId = message.message_id;
    userObj.ChatId = message.chat.id;
    userObj.TelegramId = callbackQueryfrom.id;
    userObj.Response = text;
    userObj.ResponeText = messageToAdd;
    userObj.Message = message.text ? message.text : message.caption
    userObj.Title = message.chat.title
    userObj.Name = callbackQueryfrom.first_name + " " + callbackQueryfrom.last_name ? callbackQueryfrom.last_name : "";
    userObj.CDT = getPSDate(new Date());
    userObj.F1 = (userObj.Message.includes("Pending") || userObj.Message.includes("Excellent")) ? "THERAPIST" : "ADMIN";
    userObj.F2 = message.chat.id + "-" + message.message_id;

    const init = {
      body: JSON.stringify(userObj),
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
    }
    console.log("over")
    const response = await fetch("https://psapi.pinnacleblooms.org/api/gl/pinnaclebypinnacleresponses", init);

  }
  catch (e) {
    console.log(e)
  }
}


function getPSDate(d) {
  return d.getFullYear() + "-" + (d.getMonth() > 8 ? (d.getMonth() + 1) : "0" + (d.getMonth() + 1)) +
    "-" + (d.getDate() > 9 ? d.getDate() : "0" + d.getDate()) + " " + (d.getHours() > 9 ? d.getHours() : "0" + d.getHours()) + ":" +
    (d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes()) + ":" +
    (d.getSeconds() > 9 ? d.getSeconds() : "0" + d.getSeconds())
    ;
}

/**
 * Handle incoming Message
 * https://core.telegram.org/bots/api#message
 */
function onMessage(message) {

}
function getTelegramButtonsFromArray(buttons, hideOnreply, isURL) {

  var buttonsToReturn = [];
  hideOnreply = hideOnreply ? hideOnreply : false;
  try {

    buttons.forEach(function (item, index) {
      var btnObj = {};
      var text = item.split('{#}')[0];
      var arr = [];
      btnObj.text = text;

      btnObj.callback_data = text + "{#}" + hideOnreply + (item.indexOf("{#}") > -1 ? "{#}" + item.split("{#}")[1] : "");

      arr.push(btnObj);
      buttonsToReturn.push(arr);
    });


  }
  catch (e) {
    console.log(e);
  }
  //
  return buttonsToReturn;

}

async function sendTelegramGroupMedia(channelId, message, buttonToSend, imageURL, hideOnReply) {
  console.log("sendTelegramGroupMedia")
  var finalCId = "-100" + channelId;
  var buttons = getTelegramButtonsFromArray(buttonToSend, hideOnReply);
  var response = null;
  if (imageURL) {
    console.log(JSON.stringify(imageURL));
    response = await sendGroupOfImages(finalCId, message, buttons, imageURL);
  }

  // console.log("response");
  console.log(response);
  if (imageURL && response && response.error_code && response.error_code == 400) {
    response = await sendInlineButtonsMarkUp(finalCId, message, buttons);
  }

  return response;
}

async function sendTelegramMessageWithButtons(channelId, message, buttonToSend, imageURL, hideOnReply) {
  var finalCId = "-100" + channelId;
  var buttons = getTelegramButtonsFromArray(buttonToSend, hideOnReply);
  var response = null;
  if(imageURL && imageURL.toLowerCase().indexOf(".mp4")>-1 && !message){
    response = await sendInlineButtonsMarkUpWithVideo(finalCId, message, buttons, imageURL)
  }
  else if(imageURL && imageURL.toLowerCase().indexOf(".mp3")>-1){
    response = await sendTelegramAudioFile(finalCId, message, buttons, imageURL)
  }
  else if(imageURL && imageURL.toLowerCase().indexOf(".pdf")>-1){
    response = await sendTelegramPdfFile(finalCId, message, buttons, imageURL)
  }
  else if(imageURL && !message){
    response = await sendInlineButtonsMarkUpWithImageOnly(finalCId, message, buttons, imageURL);
  }
  else if (imageURL) {
    response = await sendInlineButtonsMarkUpWithImage(finalCId, message, buttons, imageURL);
  }
  else {
    response = await sendInlineButtonsMarkUp(finalCId, message, buttons);
  }

  // console.log("response");
  console.log(response);
  if (imageURL && response && response.error_code && response.error_code == 400) {
    response = await sendInlineButtonsMarkUp(finalCId, message, buttons);
  }

  return response;
}


async function  sendTelegramMessageReply(messageId,channelId,message) {
  var finalCId = "-100" + channelId;
  var response = await sendMarkdownReplyText(messageId,finalCId,message);
  return response;
  
}

async function  sendTelegramForward(messageId,channelId,sChannelId) {
  var finalCId = "-100" + channelId;
  var finalSId = "-100" + sChannelId;
  var response = await sendForwardMessageText(messageId,finalCId,finalSId);
  return response;
  
}

//

async function  sendTelegramMessageReplyPDF(messageId,channelId,message,url) {
  var finalCId = "-100" + channelId;
  var response = await sendTelegramReplyPDF(messageId,finalCId,message,url);
  return response;
  
}


