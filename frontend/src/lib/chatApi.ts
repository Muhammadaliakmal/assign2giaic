/**
 * Chat API Client
 * 
 * Handles communication with the backend chat endpoint.
 */

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    created_at?: string;
}

export interface ToolCall {
    tool_name: string;
    inputs: Record<string, any>;
    output: Record<string, any>;
}

export interface ChatRequest {
    conversation_id?: number;
    message: string;
}

export interface ChatResponse {
    conversation_id: number;
    response: string;
    tool_calls: ToolCall[];
}

/**
 * Get authentication token from localStorage
 */
function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}

/**
 * Send a chat message to the backend
 */
export async function sendMessage(
    userId: number,
    message: string,
    conversationId?: number
): Promise<ChatResponse> {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Not authenticated');
    }

    const response = await axios.post<ChatResponse>(
        `${API_URL}/api/${userId}/chat`,
        {
            message,
            conversation_id: conversationId
        } as ChatRequest,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data;
}

/**
 * Get conversation history (if needed in the future)
 */
export async function getConversationHistory(
    userId: number,
    conversationId: number
): Promise<ChatMessage[]> {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Not authenticated');
    }

    // Note: This endpoint would need to be implemented in the backend
    // For now, we rely on the chat endpoint returning full context
    const response = await axios.get<ChatMessage[]>(
        `${API_URL}/api/${userId}/conversations/${conversationId}/messages`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    return response.data;
}
