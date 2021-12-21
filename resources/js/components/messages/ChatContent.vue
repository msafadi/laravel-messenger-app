<template>
    <div class="chat-body hide-scrollbar flex-1 h-100">
        <div class="chat-body-inner">
            <div class="py-6 py-lg-12" id="chat-body">
                <div v-for="message in $root.messages" v-bind:key="message.id" class="message" :class="{'message-out': message.user_id == $root.userId}">
                    <a href="#" data-bs-toggle="modal" data-bs-target="#modal-profile" class="avatar avatar-responsive">
                        <img class="avatar-img" v-bind:src="message.user.avatar_url" alt="">
                    </a>

                    <div class="message-inner">
                        <div class="message-body">
                            <div class="message-content">
                                <div class="message-text" v-if="message.type=='text'">
                                    <p>{{ message.body }}</p>
                                </div>
                                <div class="message-gallery" v-if="message.type=='attachment' && message.body.mimetype.match(/image\/.+/)">
                                    <div class="row gx-3">
                                        <div class="col">
                                            <img class="img-fluid rounded" v-bind:src="'/storage/'+message.body.file_path" data-action="zoom" alt="">
                                        </div>
                                    </div>
                                </div>
                                <div class="message-text" v-if="message.type=='attachment' && !message.body.mimetype.match(/image\/.+/)">
                                    <div class="row align-items-center gx-4">
                                        <div class="col-auto">
                                            <a v-bind:href="'/storage/'+message.body.file_path" class="avatar avatar-sm">
                                                <div class="avatar-text bg-white text-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-down"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                                                </div>
                                            </a>
                                        </div>
                                        <div class="col overflow-hidden">
                                            <h6 class="text-truncate text-reset">
                                                <a href="#" class="text-reset">{{ message.body.file_name }}</a>
                                            </h6>
                                            <ul class="list-inline text-uppercase extra-small opacity-75 mb-0">
                                                <li class="list-inline-item">{{ Number(message.body.file_size / 1024).toFixed(2) }} KB</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <!-- Dropdown -->
                                <div class="message-action">
                                    <div class="dropdown">
                                        <a class="icon text-muted" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                        </a>

                                        <ul class="dropdown-menu">
                                            <li>
                                                <a class="dropdown-item d-flex align-items-center" href="#">
                                                    <span class="me-auto">Edit</span>
                                                    <div class="icon">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a class="dropdown-item d-flex align-items-center" href="#">
                                                    <span class="me-auto">Reply</span>
                                                    <div class="icon">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-corner-up-left"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <hr class="dropdown-divider">
                                            </li>
                                            <li>
                                                <a class="dropdown-item d-flex align-items-center text-danger" href="#">
                                                    <span class="me-auto" @click.prevent="$root.deleteMessage(message, 'me')">Delete for me</span>
                                                    <div class="icon">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a class="dropdown-item d-flex align-items-center text-danger" href="#">
                                                    <span class="me-auto" @click.prevent="$root.deleteMessage(message, 'all')">Delete For everyone</span>
                                                    <div class="icon">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                    </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="message-footer">
                            <span class="extra-small text-muted">{{ $root.moment(message.created_at).fromNow() }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'conversation'
    ],
    data() {
        return {
            fetched: 0,
        }
    },
    mounted() {
        if (this.conversation) {
            fetch(`/api/conversations/${this.conversation.id}/messages`)
                .then(response => response.json())
                .then(json => {
                    this.$root.messages = json.messages.data.reverse();
                    let container = document.querySelector('#chat-body');
                    container.scrollTop = container.scrollHeight;
                });
        }
    },
    updated() {
        if (this.conversation && this.fetched != this.conversation.id) {
            fetch(`/api/conversations/${this.conversation.id}/messages`)
                .then(response => response.json())
                .then(json => {
                    this.$root.messages = json.messages.data.reverse();
                    this.fetched = this.conversation.id;

                    let container = document.querySelector('#chat-body');
                    container.scrollTop = container.scrollHeight;
                });
        }
    }
}
</script>