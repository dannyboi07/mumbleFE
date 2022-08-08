import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	createMsgsChat,
	addMsg,
	selectExistingCaches,
	selectUnreadMsgs,
} from "../../slices/chatSlice";
import {
	selectActiveContact,
	updatePendingMsgs,
} from "../../slices/contactsSlice";
import { updateMsgStatus } from "../../slices/chatSlice";
import { setRefreshFalse, setRefreshTrue } from "../../slices/refreshSlice";
import { selectToast, setToast } from "../../slices/toastSlice";

function WsMsgHandler({ wsConn, userId }) {
	const dispatch = useDispatch();
	const wsConnRetryTimeout = useRef(250);

	// Returns an array with the user IDs of contacts which have an active msg cache
	const existingMsgCaches = useSelector(selectExistingCaches);
	const msgCachesRef = useRef([]);

	const toast = useSelector(selectToast);
	const toastRef = useRef(null);

	const activeContactId = useSelector(selectActiveContact);
	const activeContactIdRef = useRef(null);
	const unreadMsgs = useSelector(selectUnreadMsgs(activeContactId, userId));

	function makeConn() {
		wsConn.current = new WebSocket(
			`wss://${process.env.REACT_APP_BACKEND_DOM_API}/ws`,
		);
		wsConn.current.addEventListener("open", onOpen);
		wsConn.current.addEventListener("close", closeRetryListener);
		wsConn.current.addEventListener("message", messageListener);
	}

	function messageListener(e) {
		const data = JSON.parse(e.data);
		if (data.last_seen) return; // Ignore msgs with last_seen field in them, will be handled by the Chat component
		// Incoming msg types can be delivery, msg_status, update_msg_status
		const contactId = data.from === userId ? data.to : data.from;

		if (
			activeContactIdRef.current !== contactId &&
			data.from === contactId
		) {
			dispatch(
				updatePendingMsgs({
					contactId,
					text: data.text,
				}),
			);
		}

		if (msgCachesRef.current.includes(contactId)) {
			// console.log("received data", data);
			if (data.type === "delivery") {
				dispatch(
					addMsg({
						contactId,
						message: {
							...data,
							status:
								activeContactIdRef.current === Number(contactId)
									? "read"
									: "del",
						},
					}),
				);

				wsConn.current.send(
					JSON.stringify({
						type: "msg_status",
						status:
							activeContactIdRef.current === Number(contactId)
								? "read"
								: "del",
						msg_id: data.msg_id,
						from: userId,
						to: contactId,
					}),
				);
			} else if (data.type === "msg_status") {
				// console.log("updating msg status");
				dispatch(updateMsgStatus({ ...data, contactId }));
			}
		} else {
			dispatch(
				createMsgsChat({
					contactId,
					messages: [data],
				}),
			);
		}
	}

	function onOpen() {
		if (wsConnRetryTimeout.current > 999) {
			dispatch(
				setToast({
					type: "suc",
					title: "Reconnected",
				}),
			);
			dispatch(setRefreshFalse());
		}
		wsConnRetryTimeout.current = 250;
	}

	function closeRetryListener() {
		wsConn.current = null;
		// Retry connection while backing off exponentially
		if (
			wsConnRetryTimeout.current > 999 &&
			wsConnRetryTimeout.current < 64001 &&
			(!toastRef.current || toastRef.current.type !== "warn")
		) {
			dispatch(
				setToast({
					type: "warn",
					title: "Connection lost",
					message: "Re-establishing connection",
				}),
			);
			dispatch(setRefreshTrue());
		}

		if (wsConnRetryTimeout.current < 64001) {
			setTimeout(() => {
				makeConn();
			}, (wsConnRetryTimeout.current = wsConnRetryTimeout.current * 2));
		}
	}

	useEffect(() => {
		makeConn();

		return () => {
			// console.log("wsConn closing");
			if (wsConn.current) {
				wsConn.current.removeEventListener("open", onOpen);
				wsConn.current.removeEventListener("message", messageListener);
				wsConn.current.removeEventListener("close", closeRetryListener);
				wsConn.current.close(1000);
			}
		};
	}, []);

	useEffect(() => {
		msgCachesRef.current = existingMsgCaches;
	}, [existingMsgCaches]);

	useEffect(() => {
		toastRef.current = toast;
	}, [toast]);

	useEffect(() => {
		activeContactIdRef.current = activeContactId;
	}, [activeContactId]);

	useEffect(() => {
		// console.log("unread", unreadMsgs);
		if (activeContactId && unreadMsgs.length > 0 && wsConn.current) {
			// console.log("sending read status", unreadMsgs);
			unreadMsgs.map((unreadStatus) => {
				wsConn.current.send(JSON.stringify(unreadStatus));
				dispatch(
					updateMsgStatus({
						contactId: activeContactId, // unreadStatus.from,
						msg_id: unreadStatus.msg_id,
						status: "read",
						// a: unreadStatus.
					}),
				);
			});
		}
	}, [unreadMsgs]);

	return <div></div>;
}

export default WsMsgHandler;
