<template>
    <main class="main is-visible" data-dropzone-area="">
        <div class="container h-100">
            <div v-if="!$root.conversation" class="d-flex flex-column h-100 justify-content-center text-center">
                <div class="mb-6">
                    <span class="icon icon-xl text-muted">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    </span>
                </div>

                <p class="text-muted">Pick a person from left menu, <br> and start your conversation.</p>
            </div>
            <div v-if="$root.conversation" class="d-flex flex-column h-100 position-relative">
                <!-- Chat: Header -->
                <ChatHeader :conversation="conversation" />
                <!-- Chat: Header -->

                <!-- Chat: Content -->
                <ChatContent :conversation="conversation" />
                <!-- Chat: Content -->

                <!-- Chat: Footer -->
                <ChatFooter :conversation="conversation" />
                <!-- Chat: Footer -->
            </div>
        </div>
    </main>
</template>

<script>

import ChatHeader from './ChatHeader.vue';
import ChatContent from './ChatContent.vue';
import ChatFooter from './ChatFooter.vue';


export default {
    components: {
        ChatHeader, ChatContent, ChatFooter
    },
    props: [
        "conversation"
    ],
    date() {
        return {
            messages: []
        };
    }
}
</script>