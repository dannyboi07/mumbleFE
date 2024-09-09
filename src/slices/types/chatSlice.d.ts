type MessageState =
    | BaseMessage
    | Message
    | MessageWebsocketOutput
    | MessageWebsocketInput;

interface ChatStateStructure {
    contactId: number | string | null;
    messages: MessageState[];
    queryOffset: number;
    queryDone: boolean;
    lastAcc: number; // mills from Date.now()
}

type ChatState = ChatStateStructure[];
