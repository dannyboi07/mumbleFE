import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* 
Structure of the state:
[
    {
        contactId: ,
        messages: [
            {
                from: ,
                to: ,
                message: text,
                time: ,
            }
        ],
        queryOffset: Last query offset used while retrieving this contact's messages,
        queryDone: Boolean that is true when user has finished getting every message from the server through scroll pagination,
        lastAcc: Latest time this a particular object such as this was touched by the user,
        To be used while scanning this state to clear "cache" at regular intervals 
    }
]
*/

const initialState: ChatState = [];

const chatSlice = createSlice({
    name: "chats",
    initialState: initialState,
    reducers: {
        createMsgsChat: (
            state: ChatState,
            action: PayloadAction<{
                contactId: number | string;
                messages: Message[];
            }>,
        ) => {
            return [
                ...state,
                {
                    contactId: action.payload.contactId,
                    messages: action.payload.messages.toReversed(),
                    queryOffset: 0,
                    queryDone: false,
                    lastAcc: Date.now(),
                },
            ];
        },
        addMsgs: (
            state: ChatState,
            action: PayloadAction<{
                contactId: number | string;
                messages: Message[];
            }>,
        ) => {
            return state.map((chatsObj) =>
                chatsObj.contactId === action.payload.contactId
                    ? {
                          ...chatsObj,
                          messages: [
                              ...action.payload.messages.toReversed(),
                              ...chatsObj.messages,
                          ],
                          lastAcc: Date.now(),
                      }
                    : chatsObj,
            );
        },
        addMsg: (
            state: ChatState,
            action: PayloadAction<{
                contactId: number | string;
                message: Message;
            }>,
        ) => {
            return state.map((chatsObj) =>
                chatsObj.contactId === action.payload.contactId
                    ? {
                          ...chatsObj,
                          messages: [
                              // Rewrote & condensed this part from 2 ternaries to 1 during TS rewrite.
                              // To be tested
                              ...(chatsObj.messages.length >= 20
                                  ? chatsObj.messages.slice(1)
                                  : chatsObj.messages),
                              action.payload.message,
                          ],
                          lastAcc: Date.now(),
                      }
                    : chatsObj,
            );
        },
        incrementQueryOffset: (
            state: ChatState,
            action: PayloadAction<number | string>,
        ) => {
            return state.map((chatsObj) =>
                chatsObj.contactId === action.payload
                    ? {
                          ...chatsObj,
                          queryOffset: chatsObj.queryOffset + 20,
                          lastAcc: Date.now(),
                      }
                    : chatsObj,
            );
        },
        setQueryDone: (
            state: ChatState,
            action: PayloadAction<number | string>,
        ) => {
            return state.map((chatsObj) =>
                chatsObj.contactId === action.payload
                    ? {
                          ...chatsObj,
                          queryDone: true,
                          lastAcc: Date.now(),
                      }
                    : chatsObj,
            );
        },
        updateMsgStatus: (
            state: ChatState,
            action: PayloadAction<
                {
                    contactId: number | string;
                } & MessageWebsocketInput
            >,
        ) => {
            return state.map((chatsObj) =>
                // Payload's updateType will be "sent" to indicate the msg status of a sent msg is to be updated
                // or "rcvd" to indicate the msg status of a received msg is to be updated
                // (action.payload.updateType === "sent"
                // 	? action.payload.to
                // 	: action.payload.from)
                action.payload.contactId === chatsObj.contactId
                    ? action.payload.status !== "saved"
                        ? {
                              ...chatsObj,
                              messages: chatsObj.messages.map((message) =>
                                  Number(message.id) ===
                                  Number(action.payload.msg_id)
                                      ? {
                                            ...message,
                                            status: action.payload.status,
                                        }
                                      : message,
                              ),
                          }
                        : {
                              ...chatsObj,
                              messages: chatsObj.messages.map((message) =>
                                  action.payload.msg_uuid === message.msg_id
                                      ? {
                                            ...message,
                                            msg_id: action.payload.msg_id,
                                            status: action.payload.status,
                                            time: action.payload.time,
                                        }
                                      : message,
                              ),
                          }
                    : chatsObj,
            );
        },
    },
});

// TODO
// updateMsgStatus: (
//   state: ChatState,
//   action: PayloadAction<
//       {
//           contactId: number | string;
//       } & MessageWebsocketInput
//   >,
// ) => {
//   return state.map((chatsObj) =>
//       action.payload.contactId === chatsObj.contactId
//           ? action.payload.status !== "saved"
//               ? {
//                     ...chatsObj,
//                     messages: chatsObj.messages.map((message) =>
//                         "id" in message && Number(message.id) === Number(action.payload.msg_id)
//                             ? {
//                                   ...message,
//                                   status: action.payload.status,
//                               }
//                             : message,
//                     ),
//                 }
//               : {
//                     ...chatsObj,
//                     messages: chatsObj.messages.map((message) =>
//                         "uuid" in message && action.payload.msg_uuid === message.uuid
//                             ? {
//                                   ...message,
//                                   id: action.payload.msg_id,  // This is safe now
//                                   status: action.payload.status,
//                                   time: action.payload.time,
//                               }
//                             : message,
//                     ),
//                 }
//           : chatsObj,
//   );
// },
