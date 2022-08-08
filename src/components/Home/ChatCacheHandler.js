import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectActiveContact } from "../../slices/contactsSlice";
import { clearCache } from "../../slices/chatSlice";

function ChatCacheHandler() {
	const dispatch = useDispatch();
	const cacheHandlerTimer = useRef(null);

	const activeContactId = useSelector(selectActiveContact);
	const activeContactIdRef = useRef(null);

	useEffect(() => {
		cacheHandlerTimer.current = setInterval(() => {
			dispatch(clearCache(activeContactIdRef.current));
		}, 1000 * 60);

		return () => clearInterval(cacheHandlerTimer.current);
	}, []);

	useEffect(() => {
		activeContactIdRef.current = activeContactId;
	}, [activeContactId]);

	return <div></div>;
}

export default ChatCacheHandler;
