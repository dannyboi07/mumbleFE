interface ContactSlice extends Contact {
    message: {
        text: string;
        count: number;
    };
}

interface ContactsState {
    activeContactId: number | string | null;
    contacts: ContactSlice[];
}
