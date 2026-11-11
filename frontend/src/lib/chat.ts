import { getJSON, setJSON } from './storage';

const MSG_PREFIX = 'chat_messages_';

export interface ChatMessage {
  from: 'me' | 'friend';
  text: string;
  time: string;
}

export function getMessages(friendId: string): ChatMessage[] {
  return getJSON<ChatMessage[]>(MSG_PREFIX + friendId, []);
}

export function sendMessage(friendId: string, text: string): ChatMessage[] {
  const msgs = getMessages(friendId);
  msgs.push({
    from: 'me',
    text,
    time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  });
  setJSON(MSG_PREFIX + friendId, msgs);
  return msgs;
}
