import React, { useState } from "react";
import { useSelector } from "react-redux";
import { styled } from "@stitches/react";
import { selectTheme } from "../../slices/themeSlice";
import { MsgInputCtn } from "../../stitches-components/chatStyled";
import {
	StyledLeftCtn,
	StyledNavHead,
} from "../../stitches-components/homeStyled";
import { Box } from "../../stitches-components/menuStyled";
import Contacts from "./Contacts";
import DropMenu from "./DropMenu";

const StyledSearchInput = styled("input", {
	position: "relative",
	fontSize: "0.925rem",
	width: "100%",
	height: 30,
	padding: "0.25em 0.75em",
	backgroundColor: "transparent",
	border: 0,
	outline: "none",
});

const SearchInnerDivStyles = {
	display: "flex",
	width: "100%",
	alignItems: "center",
	height: 35,
	padding: "0 0.7em",
	borderRadius: "0.25em",
};

function NavHead() {
	const [search, setSearch] = useState("");
	const theme = useSelector(selectTheme);

	return (
		<StyledLeftCtn
			css={{
				backgroundColor: theme.primCol,
			}}
		>
			<StyledNavHead>
				<h1
					style={{
						color: theme.accCol,
					}}
				>
					Mumble
				</h1>
				<DropMenu />
			</StyledNavHead>
			<hr />
			<MsgInputCtn
				css={{
					padding: "0.70em 0.8em",
					color: theme.contrast ? "black" : "white",
				}}
			>
				<Box
					css={{
						...SearchInnerDivStyles,
						backgroundColor: theme.secCol,
					}}
				>
					<svg
						width="22"
						height="22"
						viewBox="0 0 15 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
							fill="currentColor"
							fillRule="evenodd"
							clipRule="evenodd"
						></path>
					</svg>
					<StyledSearchInput
						css={{
							color: "inherit",
						}}
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</Box>
			</MsgInputCtn>
			<Contacts searchContact={search}/>
		</StyledLeftCtn>
	);
}

export default NavHead;
