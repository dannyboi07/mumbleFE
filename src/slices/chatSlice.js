import { createSlice } from "@reduxjs/toolkit";

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

export const chatSlice = createSlice({
	name: "chats",
	initialState: [],
	reducers: {
		createMsgsChat: (state, action) => {
			return [
				...state,
				{
					contactId: action.payload.contactId,
					messages: [...action.payload.messages.reverse()],
					queryOffset: 0,
					queryDone: false,
					lastAcc: Date.now(),
				},
			];
		},
		addMsgs: (state, action) => {
			const reversedMsgs = action.payload.messages.reverse();
			return state.map((chatsObj) =>
				chatsObj.contactId === action.payload.contactId
					? {
							...chatsObj,
							messages: [...reversedMsgs, ...chatsObj.messages],
							lastAcc: Date.now(),
					  }
					: chatsObj,
			);
		},
		addMsg: (state, action) => {
			return state.map((chatsObj) =>
				chatsObj.contactId === action.payload.contactId
					? chatsObj.messages.length >= 20
						? {
								...chatsObj,
								messages: [
									...chatsObj.messages.slice(1),
									action.payload.message,
								],
								lastAcc: Date.now(),
						  }
						: {
								...chatsObj,
								messages: [
									...chatsObj.messages,
									action.payload.message,
								],
								lastAcc: Date.now(),
						  }
					: chatsObj,
			);
		},
		incrementQueryOffset: (state, action) => {
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
		setQueryDone: (state, action) => {
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
		updateMsgStatus: (state, action) => {
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
									Number(message.msg_id) ===
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
		clearCache: (state, action) => {
            // Triggers every 30 secs. Msgs with a contact last accessed within 30-60 secs are all cleared,
            // except for only the latest 20 msgs
            // Msgs with contact last accessed more than a minute ago are all cleared out. 
			const newAllMsgsState = [];
			const dateNow = Date.now();

			for (let i = 0; i < state.length; i++) {
				const msgsObj = state[i];

				if (
					msgsObj.contactId !== action.payload &&
					msgsObj.lastAcc + 60000 < dateNow
				) {
					continue;
				} else if (
					msgsObj.contactId !== action.payload &&
					msgsObj.lastAcc + 30000 < dateNow
				) {
					newAllMsgsState.push({
						contactId: msgsObj.contactId,
						messages: msgsObj.messages.slice(-20),
						// If offset was 10 and queryDone was true, set it to true,
						// else to false to allow for more queries again
						queryDone:
							msgsObj.queryOffset === 20 && msgsObj.queryOffset
								? true
								: false, // false,
						queryOffset: 0,
						lastAcc: msgsObj.lastAcc,
					});
				} else if (msgsObj.contactId === action.payload) {
					newAllMsgsState.push(msgsObj);
				}
			}
			return newAllMsgsState;
		},
		eraseChatState: () => {
			return [];
		},
	},
});

export const {
	addMsg,
	addMsgs,
	createMsgsChat,
	incrementQueryOffset,
	setQueryDone,
	updateMsgStatus,
	setChatOnRefresh,
	clearCache,
	eraseChatState,
} = chatSlice.actions;

export const selectQueryOffset = (contactId) => (state) => {
	for (let i = 0; i < state.chats.length; i++) {
		if (state.chats[i].contactId === contactId) {
			return state.chats[i].queryOffset;
		}
	}
	return null;
};

export const selectExistingCaches = (state) => {
	return state.chats.map((chatsObj) => chatsObj.contactId);
};

export const selectQueryDone = (contactId) => (state) => {
	for (let i = 0; i < state.chats.length; i++) {
		if (state.chats[i].contactId === contactId)
			return state.chats[i].queryDone;
	}
	return null;
};

export const selectUnreadMsgs = (contactId, userId) => (state) => {
	const res = [];
	for (let i = 0; i < state.chats.length; i++) {
		if (state.chats[i].contactId === contactId) {
			for (let j = state.chats[i].messages.length - 1; j >= 0; j--) {
				// console.log(state.chats[i].messages[j], contactId, userId)
				if (
					Number(state.chats[i].messages[j].from) === contactId &&
					state.chats[i].messages[j].status !== "read"
				) {
					// console.log(true);
					res.push({
						msg_id: Number(state.chats[i].messages[j].msg_id),
						type: "msg_status",
						status: "read",
						from: userId,
						to: contactId,
					});
					// Below evaluates to true when status is read, not explicitly checking if status is read
				} else if (state.chats[i].messages[j].to === contactId) {
					return res;
				}
			}
		}
	}
	return res;
};

export default chatSlice.reducer;