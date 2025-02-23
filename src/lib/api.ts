export async function postChat(prompt: string) {
    const body = { prompt: prompt };
    const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error('Failed to post chat');
    return response.json();
}