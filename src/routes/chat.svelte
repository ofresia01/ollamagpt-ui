<script lang="ts">
    import { postChat } from '$lib/api';

    let message = '';
    let chatHistory: { user: string; bot: string }[] = [];
    let currentBotMessage = '';

    async function handlePostChat() {
        if (message.trim()) {
            const userMessage = message;
            message = '';
            chatHistory = [...chatHistory, { user: userMessage, bot: '' }];
            currentBotMessage = '';

            try {
                await postChat(userMessage, (chunk) => {
                    currentBotMessage += chunk;
                    chatHistory = chatHistory.map(chat => 
                        chat.user === userMessage ? { ...chat, bot: currentBotMessage } : chat
                    );
                });
            } catch (error) {
                console.error('Error posting chat: ', error);
            }
        }
    }
</script>

<div class="h-[75vh] max-w-4xl mx-auto p-6 bg-gray-900 shadow-lg opacity-85">
    <h1 class="antialiased mb-4 font-sans font-semibold tracking-tight text-6xl text-center text-sky-500">OllamaGPT</h1>
    <div class="flex-1 overflow-y-auto p-4">
        {#each chatHistory as chat}
            <div class="space-y-2">
                <div class="flex justify-end">
                    <div class="bg-blue-700 text-white p-3 rounded-lg max-w-[70%]">
                        <p>{chat.user}</p>
                    </div>
                </div>
                <div class="flex justify-start">
                    <div class="bg-gray-700 text-white p-3 rounded-lg max-w-[70%]">
                        <p>{chat.bot}</p>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>

<div class="max-w-4xl mx-auto p-4 border-t border-gray-700 bg-gray-900 opacity-100 rounded-b-lg shadow-lg">
    <div class="flex items-center gap-4">
        <input
            class="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            bind:value={message}
            placeholder="Type your message here..."
            on:keydown={(e) => e.key === 'Enter' && handlePostChat()}
        />
        <button
            class="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition disabled:bg-gray-600"
            on:click={handlePostChat}
            disabled={message.trim() === ''}
        >
            Send
        </button>
    </div>
</div>