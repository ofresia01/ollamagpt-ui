<script lang="ts">
  import { fly } from "svelte/transition";
  import Fa from "svelte-fa";
  import { faShare } from "@fortawesome/free-solid-svg-icons";
  import { postChat } from "$lib/api";
  import { marked } from "marked";

  let message: string = "";
  let chatHistory: {
    userMessage: string;
    botMessage: string;
    botThinking: boolean;
  }[] = [];
  let currentBotMessage: string = "";
  let currentMessageNumber: number = 0;

  async function handlePostChat(): Promise<void> {
    if (message.trim()) {
      const userMessage: string = message;
      message = "";
      currentMessageNumber++;
      chatHistory = [
        ...chatHistory,
        { userMessage: userMessage, botMessage: "", botThinking: false },
      ];
      currentBotMessage = "";

      try {
        await postChat(userMessage, (chunk) => {
          if (chunk === "<think>") {
            chatHistory[currentMessageNumber - 1].botThinking = true;
            return;
          }
          if (chunk === "</think>") {
            chatHistory[currentMessageNumber - 1].botThinking = false;
            return;
          } else if (!chatHistory[currentMessageNumber - 1].botThinking) {
            currentBotMessage += chunk;
            chatHistory[currentMessageNumber - 1].botMessage =
              currentBotMessage;
          }
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
            <p>{chat.userMessage}</p>
          </div>
        </div>
        <div class="flex justify-start">
          <div
            class="bg-gray-700 text-white p-3 rounded-lg max-w-[70%] mx-2 my-2"
          >
            {#if chat.botThinking}
              <p
                class="text-purple-400 text-lg animate-pulse"
                transition:fly={{ y: 20, duration: 300 }}
              >
                Thinking...
              </p>
            {:else}
              <div class="container">{@html marked(chat.botMessage)}</div>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
  <div class="p-4 border-t border-gray-700 bg-gray-900 opacity-100 shadow-lg">
    <div class="relative">
      <textarea
        class="w-full p-6 bg-gray-800 border border-gray-600 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-30 overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-6  [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:top-10"
        bind:value={message}
        placeholder="Type your message here..."
        on:keydown={(e) => e.key === "Enter" && handlePostChat()}
        on:input={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "auto"; // Reset height to auto to shrink on deletion
          target.style.height = `${target.scrollHeight}px`; // Set the height to scrollHeight
        }}
        rows="3"
      ></textarea>
      <button
        class="absolute right-10 top-1/2 transform -translate-y-1/2 bg-none border-none cursor-pointer"
        on:click={handlePostChat}
        on:keydown={((e) => e.key === "Enter" && handlePostChat())}
        disabled={message.trim() === ""}
      >
        <Fa icon={faShare} />
      </button>
    </div>
  </div>
</div>
