

function sendMessageBtnPressed() {
    const input_field = document.getElementById('message-input-field');
    const input = input_field.value;

    input_field.value = "";
    
    sendMessage(input)
        .then(_ => requestMessages())
        .then(messages => fillMessagePanel(messages));
}

function messageDeleteBtnPressed(message_id) {
    deleteMessage(message_id)
        .then(_ => requestMessages())
        .then(messages => fillMessagePanel(messages));
}

async function deleteMessage(message_id) {
    let request = await fetch("http://127.0.0.1:8000/messages/" + message_id, { 
        method: 'DELETE',
    });

    await throwIfRequestUnsuccessful(request);

    let data = await request.json()

    return data
}

async function sendMessage(text) {
    let request = await fetch("http://127.0.0.1:8000/messages", { 
        method: "POST",
        headers: {
            "Content-Type": "text/plain",
        },
        body: text,
    });
    
    await throwIfRequestUnsuccessful(request);

    let data = await request.json()

    return data
}

async function requestMessages() {
    let message_group_request = await fetch("http://127.0.0.1:8000/messages/recent")
    await throwIfRequestUnsuccessful(message_group_request)

    let data = await message_group_request.json()

    let messages = new Array(data.length)

    for (let i = 0; i < messages.length; i++) {
        let message_id = data[i];

        let message_request = await fetch("http://127.0.0.1:8000/messages/" + message_id)
        let message_content = await message_request.json()
        messages[i] = {
            "id": message_id,
            "text": message_content,
        }
    }

    return messages
}

function fillMessagePanel(messages) {
    clearMessagePanel()

    const template = document.getElementById('message-template');
    const container = document.getElementById('message-container');

    messages.forEach(message => {
        const message_id = message.id;

        // Clone the template content
        const newMessage = template.content.cloneNode(true);
        
        newMessage.querySelector('.message').id = "message-" + message_id;

        const message_label = newMessage.querySelector('.message-text');
        message_label.textContent = message.text;
        
        const deleteButton = newMessage.querySelector('.delete-btn');
        deleteButton.addEventListener('click', function() {
            messageDeleteBtnPressed(message_id);
        });
        
        container.appendChild(newMessage);
    });
}

function clearMessagePanel() {
    const container = document.getElementById('message-container');

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

async function throwIfRequestUnsuccessful(request) {
    if (request.status != 200) {
        throw new Error("Error " + request.status + ": " + JSON.stringify(await request.json()))
    }
}

document.getElementById('send-btn').addEventListener('click', sendMessageBtnPressed);

requestMessages().then(messages => fillMessagePanel(messages))