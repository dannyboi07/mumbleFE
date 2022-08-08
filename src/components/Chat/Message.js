import React from "react";
import { useSelector } from "react-redux";
import { selectTheme } from "../../slices/themeSlice";
import {
	StyledMsg,
	StyledMsgDate,
	MsgFlareLeft,
	MsgFlareRight,
} from "../../stitches-components/chatStyled";
import { blue } from "@radix-ui/colors";

function Message({ date, rcvdMsg, text, time, status, noFlare, marginTop }) {
	const theme = useSelector(selectTheme);
	return (
		<>
			{date && (
				<StyledMsgDate
					css={{
						alignSelf: "center",
						backgroundColor: theme.accCol,
						color: theme.contrast ? "white" : "black",
						position: "sticky",
						top: 10,
						zIndex: 1,
					}}
				>
					{date}
				</StyledMsgDate>
			)}
			<StyledMsg
				css={{
					backgroundColor: rcvdMsg ? theme.accCol : theme.primCol,
					color: rcvdMsg
						? theme.contrast
							? "white"
							: "black"
						: theme.contrast
						? "black"
						: "white",
					alignSelf: rcvdMsg ? "flex-start" : "flex-end",
					alignItems: rcvdMsg ? "flex-start" : "flex-end",
					borderRadius: noFlare
						? "0.4em 0.4em 0.4em 0.4em"
						: rcvdMsg
						? " 0 0.4em 0.4em 0.4em"
						: "0.4em 0 0.4em 0.4em",
					marginTop: marginTop ? marginTop : "",
				}}
			>
				<p>{text}</p>
				<span>
					{time}
					{!rcvdMsg ? (
						status === "read" || status === "del" ? ( // Double tick
							<svg
								width="20"
								height="20"
								viewBox="0 0 50 50"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									style={{
										textIndent: "0",
										textAlign: "start",
										lineHeight: "normal",
										textTransform: "none",
										blockProgression: "tb",
									}}
									d="M 37.90625 8.96875 A 1.0001 1.0001 0 0 0 37.78125 9 A 1.0001 1.0001 0 0 0 37.21875 9.375 L 12.9375 38.5 L 1.71875 27.28125 A 1.016466 1.016466 0 1 0 0.28125 28.71875 L 12.28125 40.71875 A 1.0001 1.0001 0 0 0 13.78125 40.625 L 38.78125 10.625 A 1.0001 1.0001 0 0 0 37.90625 8.96875 z M 48.90625 8.96875 A 1.0001 1.0001 0 0 0 48.78125 9 A 1.0001 1.0001 0 0 0 48.21875 9.375 L 23.9375 38.5 L 21.375 35.96875 A 1.0001 1.0001 0 1 0 19.96875 37.375 L 23.28125 40.71875 A 1.0001 1.0001 0 0 0 24.78125 40.625 L 49.78125 10.625 A 1.0001 1.0001 0 0 0 48.90625 8.96875 z"
									overflow="visible"
									fill={
										status === "read"
											? blue.blue9
											: theme.contrast
											? "gray"
											: "lightgray"
									}
								/>
							</svg>
						) : status === "saved" ? ( // Single tick
							<svg
								width="20"
								height="20"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 50 50"
							>
								<path
									d="M47.293 6.94 14 40.232 2.707 28.94l-1.414 1.413L14 43.06 48.707 8.353z"
									fill={theme.contrast ? "gray" : "lightgray"}
								/>
							</svg>
						) : (
							<svg
								width="20"
								height="20"
								viewBox="0 0 15 15"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M7.50009 0.877014C3.84241 0.877014 0.877258 3.84216 0.877258 7.49984C0.877258 11.1575 3.8424 14.1227 7.50009 14.1227C11.1578 14.1227 14.1229 11.1575 14.1229 7.49984C14.1229 3.84216 11.1577 0.877014 7.50009 0.877014ZM1.82726 7.49984C1.82726 4.36683 4.36708 1.82701 7.50009 1.82701C10.6331 1.82701 13.1729 4.36683 13.1729 7.49984C13.1729 10.6328 10.6331 13.1727 7.50009 13.1727C4.36708 13.1727 1.82726 10.6328 1.82726 7.49984ZM8 4.50001C8 4.22387 7.77614 4.00001 7.5 4.00001C7.22386 4.00001 7 4.22387 7 4.50001V7.50001C7 7.63262 7.05268 7.7598 7.14645 7.85357L9.14645 9.85357C9.34171 10.0488 9.65829 10.0488 9.85355 9.85357C10.0488 9.65831 10.0488 9.34172 9.85355 9.14646L8 7.29291V4.50001Z"
									fill={theme.contrast ? "gray" : "lightgray"}
									fillRule="evenodd"
									clipRule="evenodd"
								></path>
							</svg>
						)
					) : (
						<></>
					)}
				</span>
				{noFlare ? (
					<></>
				) : rcvdMsg ? (
					<MsgFlareLeft
						css={{
							backgroundColor: theme.accCol,
						}}
					/>
				) : (
					<MsgFlareRight
						css={{
							backgroundColor: theme.primCol,
						}}
					/>
				)}
			</StyledMsg>
		</>
	);
}

export default Message;
