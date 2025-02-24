<script lang="ts">
  import Fa from "svelte-fa";
  import { faShare } from "@fortawesome/free-solid-svg-icons";
  import { postChat } from "$lib/api";

  let message: string = "";
  let chatHistory: { user: string; bot: string }[] = [];
  let currentBotMessage: string = "";

  async function handlePostChat(): Promise<void> {
    if (message.trim()) {
      const userMessage: string = message;
      message = "";
      chatHistory = [...chatHistory, { user: userMessage, bot: "" }];
      currentBotMessage = "";

      try {
        await postChat(userMessage, (chunk) => {
          currentBotMessage += chunk;
          chatHistory = chatHistory.map((chat) =>
            chat.user === userMessage
              ? { ...chat, bot: currentBotMessage }
              : chat
          );
        });
      } catch (error: unknown) {
        console.error("Error posting chat: ", error);
      }
    }
  }
</script>

<div
  class="h-[75vh] max-w-4xl mx-auto p-6 bg-gray-900 opacity-85 flex flex-col rounded-4xl"
>
  <h1
    class="antialiased mb-8 font-sans font-semibold tracking-tight text-4xl text-center text-sky-500"
  >
    OllamaGPT
  </h1>
  <div class="flex-1 overflow-y-auto p-4">
    {#each chatHistory as chat}
      <div class="container">
        <div class="flex justify-end">
          <div
            class="bg-blue-700 text-white p-3 rounded-lg max-w-[70%] mx-2 my-4"
          >
            <p>{chat.user}</p>
          </div>
        </div>
        <div class="flex justify-start">
          <div
            class="bg-gray-700 text-white p-3 rounded-lg max-w-[70%] mx-2 my-2"
          >
            <p>{chat.bot}</p>
          </div>
        </div>
      </div>
    {/each}
  </div>
  <div class="p-4 border-t border-gray-700 bg-gray-900 opacity-100 shadow-lg">
    <div class="relative">
      <input
        class="w-full p-6 bg-gray-800 border border-gray-600 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        bind:value={message}
        placeholder="Type your message here..."
        on:keydown={(e) => e.key === "Enter" && handlePostChat()}
      />
      <button
        class="absolute right-10 top-1/2 transform -translate-y-1/2 bg-none border-none cursor-pointer"
        on:click={handlePostChat}
        disabled={message.trim() === ""}
      >
        <Fa icon={faShare} />
      </button>
    </div>
  </div>
</div>
