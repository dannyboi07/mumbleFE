import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

/* State map
{   
    activeContactId: (userId)
    contacts: [
        {
            userId:
            name: 
            profile_pic: (url),
            message: {
                text: ,
                count: 
            }
        },
        ...
    ]
}
*/

const initialState: ContactsState = {
    activeContactId: null,
    contacts: [],
};

const contactsSlice = createSlice({
    name: "contacts",
    initialState: initialState,
    reducers: {
        addContact: (
            state: ContactsState,
            action: PayloadAction<Contact | ContactSlice>,
        ) => {
            return {
                ...state,
                contacts: [
                    ...state.contacts,
                    "message" in action.payload
                        ? {
                              ...action.payload,
                              message: {
                                  ...action.payload.message,
                              },
                          }
                        : {
                              ...action.payload,
                          },
                ],
            };
        },
        setActiveContact: (
            state: ContactsState,
            action: PayloadAction<number | string | null>,
        ) => {
            return {
                ...state,
                activeContactId: action.payload,
            };
        },
        updatePendingMsgs: (
            state: ContactsState,
            action: PayloadAction<{
                contactId: number | string;
                text: string;
            }>,
        ) => {
            let indexOf = -1;
            for (let i = 0; i < state.contacts.length; i++) {
                if (state.contacts[i].userId === action.payload.contactId) {
                    indexOf = i;
                    break;
                }
            }
            if (indexOf === -1) return state;

            const contactToMoveAhead: ContactSlice = {
                ...state.contacts[indexOf],
                message: {
                    text: action.payload.text,
                    count: state.contacts[indexOf].message.count + 1,
                },
            };
            return {
                ...state,
                contacts: [
                    contactToMoveAhead,
                    ...state.contacts.filter(
                        (contact) =>
                            contact.userId !== action.payload.contactId,
                    ),
                ],
            };
        },
        clearPendingMsgs: (
            state: ContactsState,
            action: PayloadAction<number | string>,
        ) => {
            return {
                ...state,
                contacts: state.contacts.map((contact) =>
                    contact.userId === action.payload
                        ? {
                              ...contact,
                              message: {
                                  text: "",
                                  count: 0,
                              },
                          }
                        : contact,
                ),
            };
        },
        eraseContactsState: () => {
            return {
                ...initialState,
            };
        },
    },
});

const {
    addContact,
    setActiveContact,
    updatePendingMsgs,
    clearPendingMsgs,
    eraseContactsState,
} = contactsSlice.actions;

const selectContacts = (state: RootState) => state.contacts.contacts;
const selectActiveContact = (state: RootState) =>
    state.contacts.activeContactId;
const selectActiveContactDetails = (state: RootState) =>
    state.contacts.contacts.find(
        (contact) => contact.userId === state.contacts.activeContactId,
    );
const selectPendingMsgs =
    (contactId: number | string) => (state: RootState) => {
        for (let i = 0; i < state.contacts.contacts.length; i++) {
            if (state.contacts.contacts[i].userId === contactId) {
                return state.contacts.contacts[i].message;
            }
        }

        return null;
    };

export {
    contactsSlice,
    addContact,
    setActiveContact,
    updatePendingMsgs,
    clearPendingMsgs,
    eraseContactsState,
    selectContacts,
    selectActiveContact,
    selectActiveContactDetails,
    selectPendingMsgs,
};
export default contactsSlice.reducer;

// let indexOf = -1;
// 			for (let i = 0; i < state.contacts.length; i++) {
// 				if (state.contacts[i].user_id === action.payload.contactId) {
// 					indexOf = i;
// 					break;
// 				}
// 			}
// 			if (indexOf === -1) return state;

// 			const contactMoveFront = state.contacts[indexOf];
// 			const contactMoveBack = state.contacts[0];

// 			return {
// 				...state,
// 				contacts: state.contacts.map((contactObj, i) => {
// 					if (i === 0) {
// 						return {
// 							...contactMoveFront,
// 							message: {
// 								text: action.payload.text,
// 								pendingCount:
// 									contactMoveFront.message.pendingCount + 1,
// 							},
// 						};
// 					} else if (i === indexOf) return contactObj;
// 				}),
// 			};
