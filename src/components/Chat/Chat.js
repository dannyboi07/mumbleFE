import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLazyAxios } from "../../hooks/useLazyAxios";
import {
	addMsg,
	addMsgs,
	createMsgsChat,
	selectQueryOffset,
	setQueryDone,
} from "../../slices/chatSlice";
// import { selectRefresh } from "../../slices/refreshSlice";
import { selectActiveContact } from "../../slices/contactsSlice";
import { selectTheme } from "../../slices/themeSlice";
// import { styled } from "@stitches/react";
import {
	// StyledMsgInputCtn,
	MsgInputCtn,
	StyledMsgInput,
} from "../../stitches-components/chatStyled";
import { StyledChat } from "../../stitches-components/homeStyled";
import ChatProfile from "./ChatProfile";
import MsgDisplay from "./MsgDisplay";
import { v4 as uuidv4 } from "uuid";

function Chat({ userId, wsConn }) {
	const dispatch = useDispatch();

	const [msgInput, setMsgInput] = useState("");
	const [toScroll, setToScroll] = useState(true); // Notifying child chat comp to pull the scrollbar to the bottom or not
	const [stopPagin, setStopPagin] = useState(false); // Used by child to stop the scroll listener from triggering after dispatching, i.e used for throttling pagination

	const [msgInpPlc, setMsgInpPlc] = useState("shw-plchldr");

	const activeContactId = useSelector(selectActiveContact);
	// const refresh = useSelector(selectRefresh);
	const theme = useSelector(selectTheme);
	const msgCacheExists = useSelector((state) =>
		state.chats.find((chat) => chat.contactId === activeContactId),
	);
	const msgCacheOffset = useSelector(selectQueryOffset(activeContactId));

	const { lazyFetch, response, isLoading, error } = useLazyAxios({
		method: "GET",
		url: `/messages/${activeContactId}?skip=${msgCacheOffset}`,
		withCredentials: true,
	});

	useEffect(() => {
		if (activeContactId) {
			setToScroll(true);
			setStopPagin(false);
			if (!msgCacheExists) {
				dispatch(
					createMsgsChat({
						contactId: activeContactId,
						messages: [],
					}),
				);
			}
		}
	}, [activeContactId]);

    // Dispatches query to the server, triggers when the active chat contact or the query offset changes, 
    // and execs the logic as long as there are more msgs to be retrieved (indicated by .queryDone), and 
    // the offset value is greater than the length of msgs
	useEffect(() => {
		// Don't query the server any more after receiving null
		if (
			activeContactId !== null &&
			activeContactId !== undefined &&
			msgCacheOffset !== null &&
			msgCacheOffset !== undefined
		) {
			if (!msgCacheExists.queryDone) {
				if (msgCacheExists.messages.length <= msgCacheOffset) {
					lazyFetch();
				}
			}
		}
	}, [activeContactId, msgCacheOffset]);

	// console.log(activeContactId, typeof(activeContactId))

	useEffect(() => {
		if (response?.messages && !error) {
			dispatch(
				addMsgs({
					contactId: activeContactId,
					messages: response.messages,
				}),
			);
			if (msgCacheOffset === 0) setToScroll(true);
			setStopPagin(false);
			// Else If: Response will be null when no more data is available, don't dispatch that response to the store
			// && notify msgDisplay through stopPagin to stop pagination
		} else if (!response?.messages && !error) {
			dispatch(setQueryDone(activeContactId));
			setStopPagin(true);
		}
	}, [response]);

	// useEffect(() => {
	//     if (refresh) {
	//         setStopPagin(true);
	//     } else if (refresh === false) setStopPagin(false)
	// }, [refresh]);

	function sendMsg(e) {
		if (msgInput.trim().length > 0) {
			const msg = {
				msg_uuid: uuidv4(),
				type: "msg",
				// status: "sending",
				from: userId,
				to: activeContactId,
				text: msgInput,
			};
			wsConn.current.send(JSON.stringify(msg));

			dispatch(
				addMsg({
					contactId: activeContactId,
					message: {
						msg_id: msg.msg_uuid,
						status: "sending",
						from: msg.from,
						to: msg.to,
						text: msg.text,
						time: Date.now(),
					},
				}),
			);
			e.currentTarget.textContent = "";
			setMsgInput("");
		}
	}

	if (!activeContactId) {
		return (
			<StyledChat
				css={{
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: theme.primCol,
					borderLeft: `1px solid ${theme.accCol}`,
					color: theme.contrast ? "black" : "white",
				}}
			>
				<h1>Select a chat</h1>
			</StyledChat>
		);
	}

	return (
		<StyledChat
			css={{
				backgroundColor: theme.primCol,
				borderLeft: `1px solid ${theme.accCol}`,
				color: theme.contrast ? "black" : "white",
			}}
		>
			<ChatProfile wsConn={wsConn} />
			{activeContactId && (
				<MsgDisplay
					activeContactId={activeContactId}
					isLoading={isLoading}
					toScroll={toScroll}
					setToScroll={setToScroll}
					// stopQuery={stopQuery}
					pausePaging={stopPagin}
					setPausePaging={setStopPagin}
				/>
			)}
			{activeContactId && (
				<MsgInputCtn
					css={{
						backgroundColor: "transparent",
					}}
				>
					<StyledMsgInput
						className={msgInpPlc}
						onFocus={() => setMsgInpPlc("")}
						onBlur={() =>
							msgInput.length === 0 && setMsgInpPlc("shw-plchldr")
						}
						css={{
							backgroundColor: theme.secCol,
						}}
						contentEditable={true}
						onInput={(e) =>
							setMsgInput(e.currentTarget.textContent)
						}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								sendMsg(e);
							}
						}}
					/>
					<button
						style={{
							backgroundColor: "transparent",
							color: theme.contrast ? "black" : "white",
						}}
						onClick={sendMsg}
						disabled={msgInput.trim().length === 0 ? true : false}
					>
						<svg
							width="15"
							height="15"
							viewBox="0 0 15 15"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22092 7.90002 9.4 7.72094 9.4 7.50002C9.4 7.27911 9.22092 7.10002 9 7.10002H4.84553Z"
								fill="currentColor"
								fillRule="evenodd"
								clipRule="evenodd"
							></path>
						</svg>
					</button>
				</MsgInputCtn>
			)}
		</StyledChat>
	);
}

export default Chat;

/* <StyledMsgInputCtn ref={msgInCtnRef}>
						<textarea
							style={{
								color: theme.contrast ? "black" : "white",
							}}
							value={msgInput}
							onChange={(e) => {
								setMsgInput(e.target.value);
								msgInCtnRef.current.style.height = "auto";
								msgInCtnRef.current.style.height =
									e.target.scrollHeight < 30
										? `${45}px`
										: `${e.target.scrollHeight * 2}px`;
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									sendMsg();
								}
							}}
							placeholder="Message..."
							required
						/>
					</StyledMsgInputCtn> */

// msgInCtnRef.current.style.height = "auto"
//e.target.style.height = e.target.scrollHeight < 50 ? `${30}px` : `${e.target.scrollHeight}px`
// msgInCtnRef.current.style.height = e.target.scrollHeight
// console.log(e.target.style.height)
// e.target.innerHeight = e.target.scrollHeight
