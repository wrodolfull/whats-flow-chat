
export interface Chatbot {
  id: string;
  name: string;
  description: string;
  model: string;
  systemPrompt: string;
  status: 'active' | 'inactive' | 'training';
  assignedNumbers: string[];
  totalConversations: number;
  avgResponseTime: string;
  voiceEnabled: boolean;
  fileHandling: boolean;
  createdAt: string;
}

export const getChatbots = (): Chatbot[] => {
  const saved = localStorage.getItem('chatbots');
  if (saved) {
    return JSON.parse(saved);
  }
  
  // Dados iniciais se não houver nada salvo
  const defaultChatbots: Chatbot[] = [
    {
      id: '1',
      name: 'Suporte Geral',
      description: 'Chatbot para atendimento geral e suporte técnico',
      model: 'gpt-4o',
      systemPrompt: 'Você é um assistente de suporte técnico amigável e prestativo.',
      status: 'active',
      assignedNumbers: ['+55 11 99999-9999', '+55 11 88888-8888'],
      totalConversations: 1247,
      avgResponseTime: '1.2s',
      voiceEnabled: true,
      fileHandling: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Vendas',
      description: 'Bot especializado em vendas e conversão de leads',
      model: 'gpt-4o-mini',
      systemPrompt: 'Você é um consultor de vendas experiente focado em conversão.',
      status: 'active',
      assignedNumbers: ['+55 11 77777-7777'],
      totalConversations: 856,
      avgResponseTime: '0.8s',
      voiceEnabled: false,
      fileHandling: true,
      createdAt: '2024-01-10'
    }
  ];
  
  localStorage.setItem('chatbots', JSON.stringify(defaultChatbots));
  return defaultChatbots;
};

export const saveChatbot = (chatbot: Chatbot): void => {
  const chatbots = getChatbots();
  const existingIndex = chatbots.findIndex(c => c.id === chatbot.id);
  
  if (existingIndex >= 0) {
    chatbots[existingIndex] = chatbot;
  } else {
    chatbots.push(chatbot);
  }
  
  localStorage.setItem('chatbots', JSON.stringify(chatbots));
};

export const deleteChatbot = (id: string): void => {
  const chatbots = getChatbots();
  const filtered = chatbots.filter(c => c.id !== id);
  localStorage.setItem('chatbots', JSON.stringify(filtered));
};
