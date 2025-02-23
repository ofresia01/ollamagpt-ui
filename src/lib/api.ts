export async function postChat(prompt: string, onMessage: (message: string) => void) {
    const body = { prompt: prompt };
    const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'bypass_validation': 'true' },
        body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error('Failed to post chat');
    
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let doneStreaming = false;

    while (!doneStreaming) {
        const { value, done: doneReading } = await reader?.read()!;
        doneStreaming = doneReading;
        const chunk = decoder.decode(value, { stream: true });
        onMessage(chunk);
    }
}