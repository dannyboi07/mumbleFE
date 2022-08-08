import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../slices/userSlice";
import { StyledHome } from "../../stitches-components/homeStyled";
import Chat from "../Chat/Chat";
import ChatCacheHandler from "./ChatCacheHandler";
import NavHead from "./NavHead";
import WsMsgHandler from "./WsMsgHandler";

function Home() {
	const user = useSelector(selectUser);
	const wsConn = useRef(null);

	useEffect(() => {
		document.title = "Mumble";
	}, []);

	return (
		<StyledHome>
			<NavHead />
			<Chat userId={user.user_id} wsConn={wsConn} />
			<WsMsgHandler userId={user.user_id} wsConn={wsConn} />
			<ChatCacheHandler />
		</StyledHome>
	);
}

export default Home;