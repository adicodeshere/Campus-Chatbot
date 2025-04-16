class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const {openButton, chatBox, sendButton} = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active');
             // Check if it's the first time the chatbox is opened
        if (this.messages.length === 0) {
            let welcomeMessage = { name: "Sam", message: "Hi! I'm here to help. How can I assist you today?" };
            this.messages.push(welcomeMessage);
            this.updateChatText(chatbox);
            //
            let instruct = { name: "Sam", message: "You can ask me any question about your future Campus !" };
            this.messages.push(instruct);
            this.updateChatText(chatbox);
        }
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())
          .then(r => {
            let msg2 = { name: "Sam", message: r.answer };
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
          });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item) {
            let message = item.message;

            // Detect URLs in the message and convert them to clickable links
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            message = message.replace(urlRegex, function(url) {
                return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
            });

            if (item.name === "Sam") {
                html += `<div class="messages__item messages__item--visitor">${message}</div>`;
            } else {
                html += `<div class="messages__item messages__item--operator">${message}</div>`;
            }
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}


const chatbox = new Chatbox();
chatbox.display();