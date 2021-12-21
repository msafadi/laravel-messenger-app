import { createApp } from "vue";
import Messenger from "./components/messages/Messenger.vue"
import ChatList from "./components/messages/ChatList.vue"
import Echo from 'laravel-echo';

window.Pusher = require('pusher-js');

const chatApp = createApp({
    data() {
        return {
            conversations: [],
            conversation: null,
            messages: [],
            userId: userId,
            csrfToken: csrf_token,
            laravelEcho: null,
            users: [],
            chatChannel: null,
            alertAudio: new Audio('/assets/mixkit-correct-answer-tone-2870.wav')
        }
    },
    mounted() {

        this.alertAudio.addEventListener('ended', () => {
            this.alertAudio.currentTime = 0;
        })

        this.laravelEcho = new Echo({
            broadcaster: 'pusher',
            key: process.env.MIX_PUSHER_APP_KEY,
            cluster: process.env.MIX_PUSHER_APP_CLUSTER,
            forceTLS: true
        });

        this.laravelEcho
            .join(`Messenger.${this.userId}`)
            .listen('.new-message', (data) => {
                    let exists = false;
                    for (let i in this.conversations) {
                        let conversation = this.conversations[i];
                        if (conversation.id == data.message.conversation_id) {
                            if (!conversation.hasOwnProperty('new_messages')) {
                                conversation.new_messages = 0;
                            }
                            conversation.new_messages++;
                            conversation.last_message = data.message;
                            exists = true;
                            this.conversations.splice(i, 1);
                            this.conversations.unshift(conversation);

                            if (this.conversation && this.conversation.id == conversation.id) {
                                this.messages.push(data.message);
                                let container = document.querySelector('#chat-body');
                                container.scrollTop = container.scrollHeight;
                            }
                            break;
                        }
                    }
                    if (!exists) {
                        fetch(`/api/conversations/${data.message.conversation_id}`)
                            .then(response => response.json())
                            .then(json => {
                                this.conversations.unshift(json)
                            })
                    }
                
                    this.alertAudio.play();
                
            });
        this.chatChannel = this.laravelEcho.join('Chat')
            .joining((user) => {
                for (let i in this.conversations) {
                    let conversation = this.conversations[i];
                    if (conversation.participants[0].id == user.id) {
                        this.conversations[i].participants[0].isOnline = true;
                        return;
                    }
                }
            })
            .leaving((user) => {
                for (let i in this.conversations) {
                    let conversation = this.conversations[i];
                    if (conversation.participants[0].id == user.id) {
                        this.conversations[i].participants[0].isOnline = false;
                        return;
                    }
                }
            })
            .listenForWhisper('typing', (e) => {
                let user = this.findUser(e.id, e.conversation_id);
                if (user) {
                    user.isTyping = true;
                }
            })
            .listenForWhisper('stopped-typing', (e) => {
                let user = this.findUser(e.id, e.conversation_id);
                if (user) {
                    user.isTyping = false;
                }
            });
    },
    methods: {
        moment(time) {
            return moment(time);
        },
        isOnline(user) {
            for (let i in this.users) {
                if (this.users[i].id == user.id) {
                    return this.users[i].isOnline;
                }
            }
            return false;
        },
        findUser(id, conversation_id) {
            for (let i in this.conversations) {
                let conversation = this.conversations[i];
                if (conversation.id === conversation_id && conversation.participants[0].id == id) {
                    return this.conversations[i].participants[0];
                }
            }
        },
        markAsRead(conversation = null) {
            if (conversation == null) {
                conversation = this.conversation;
            }
            fetch(`/api/conversations/${conversation.id}/read`, {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({
                    _token: this.$root.csrfToken
                })
            })
            .then(response => response.json())
            .then(json => {
                conversation.new_messages = 0;
            })
        },
        deleteMessage(message, target) {
            fetch(`/api/messages/${message.id}`, {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({
                    target: target,
                    _token: this.$root.csrfToken
                })
            })
            .then(response => response.json())
            .then(json => {
                // let idx = this.messages.indexOf(message);
                // this.messages.splice(idx, 1);
                message.body = 'Message deleted..'
            })
        }
    }
});
chatApp.component('ChatList', ChatList);
chatApp.component('Messenger', Messenger);
chatApp.mount('#chat-app');
