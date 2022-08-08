import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { parseInitials } from "../../features/utils";
import { selectActiveContactDetails } from "../../slices/contactsSlice";
// import { useAxios } from "../../hooks/useAxios";
import { StyledChatProfile } from "../../stitches-components/chatStyled";
import {
	Avatar,
	AvatarImage,
	AvatarFallback,
} from "../../stitches-components/commonStyled";
import { selectUserId } from "../../slices/userSlice";

function parseOnline(status) {
	if (status === "Online") return "Online";
	else {
		const statusDate = new Date(status);
		const statusTime = statusDate.toLocaleString("en-US", {
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		});

		const statusLocaleDateString = statusDate.toLocaleDateString();

		const currDate = new Date();
		if (
			statusDate.getMonth() === currDate.getMonth() &&
			statusDate.getFullYear() === currDate.getFullYear()
		) {
			if (statusDate.getDate() === currDate.getDate())
				return `Last seen today at ${statusTime}`;
			else if (statusDate.getDate() === currDate.getDate() - 1)
				return `Last seen yesterday at ${statusTime}`;
		}
		return `Last seen on ${statusLocaleDateString} at ${statusTime}`;
	}
}

function ChatProfile({ wsConn }) {
	const userId = useSelector(selectUserId);
	const contactDetails = useSelector(selectActiveContactDetails);
	const [lastSeen, setLastSeen] = useState("");
	const themePrimCol = useSelector((state) => state.theme.primCol);

	useEffect(() => {
		function handleWsStatusListener(e) {
			const data = JSON.parse(e.data);
			if (data.last_seen) {   // Depending on falsiness of "" here, data.lst-sn will be "", when data can't be retrieved
				setLastSeen(parseOnline(data.last_seen));
			} else setLastSeen(""); // Set like so when lst-sn is ""
		}

		if (wsConn.current && contactDetails) {
			wsConn.current.addEventListener("message", handleWsStatusListener);
			wsConn.current.send(
				JSON.stringify({
					type: "get_lst_sn",
					from: userId,
					to: contactDetails.user_id,
				}),
			);
		}

		return () => {
			if (wsConn.current) {
				wsConn.current.removeEventListener(
					"message",
					handleWsStatusListener,
				);
			}
		};
	}, [contactDetails, wsConn.current]);

	return (
		<StyledChatProfile
			css={{
				backgroundColor: themePrimCol,
			}}
		>
			{contactDetails && (
				<>
					<Avatar
						css={{
							width: 50,
							height: 50,
							margin: "0 0.75em 0 1em",
						}}
					>
						<AvatarImage
							src={contactDetails.profile_pic}
							alt={contactDetails.name}
						/>
						<AvatarFallback delayMs={0}>
							{parseInitials(contactDetails.name)}
						</AvatarFallback>
					</Avatar>
					<div>
						<p className="contact-name">{contactDetails.name}</p>
						{lastSeen !== "" && <p className="contact-lst-sn">{lastSeen}</p>}
					</div>
				</>
			)}
		</StyledChatProfile>
	);
}

export default ChatProfile;