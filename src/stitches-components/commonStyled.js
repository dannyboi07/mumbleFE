import { styled } from "@stitches/react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { blackA } from "@radix-ui/colors";

const StyledForm = styled("form", {
	border: "1px solid black",
	padding: "2em 1.5em",
	borderRadius: "0.25em",
});

const StyledInput = styled("input", {
	position: "relative",
	fontSize: "1rem",
	width: "100%",
	display: "block",

	// "&:not([type=\"file\"])": {
	//     "&::before": {
	//         position: "absolute",
	//         width: "100%",
	//         height: "100%",
	//         top: 0,
	//         left: 0,
	//         backgroundColor: "black"
	//     },

	//     "&[type=\"email\"]::before": {
	//         content: "Email"
	//     },

	//     "&[type=\"password\"]::before": {
	//         content: "Password"
	//     }
	// },
});

const labelStyleWhenInputFilled = {
	"&::before": {
		fontSize: "0.875rem",
		transform: "translate(10%, -30%)",
		backgroundColor: "white",
	},
};

const StyledLabel = styled("label", {
	"&::before": {
		position: "absolute",
		padding: "0 0.25em",
		transform: "translate(10%, 70%)",
		transition: "font-size 0.25s, transform 0.25s",
		zIndex: 1,
		pointerEvents: "none",
	},

	"&:focus-within": {
		"&::before": {
			fontSize: "0.875rem",
			transform: "translate(10%, -30%)",
			backgroundColor: "white",
		},
	},

	variants: {
		kind: {
			email: {
				"&::before": {
					content: "Email",
				},
			},
			pw: {
				"&::before": {
					content: "Password",
				},
			},
			name: {
				"&::before": {
					content: "Name",
				},
			},
		},
	},
});

const StyledButton = styled("button", {
	fontSize: "1rem",
	padding: "0.5em 1em",
});

const StyledAvatar = styled(AvatarPrimitive.Root, {
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	verticalAlign: "middle",
	overflow: "hidden",
	userSelect: "none",
	borderRadius: "100%",
	backgroundColor: blackA.blackA3,
	border: "1px solid black",
});

const StyledImage = styled(AvatarPrimitive.Image, {
	width: "100%",
	height: "100%",
	objectFit: "cover",
	borderRadius: "inherit",
});

const StyledFallback = styled(AvatarPrimitive.Fallback, {
	width: "100%",
	height: "100%",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	backgroundColor: "white",
	color: blackA.blackA12,
	fontSize: "1.5rem",
	lineHeight: 1,
	fontWeight: 500,
	textTransform: "uppercase",
});

export {
	StyledForm,
	StyledLabel,
	labelStyleWhenInputFilled as labelStyle,
	StyledInput,
	StyledButton,
	StyledAvatar as Avatar,
	StyledImage as AvatarImage,
	StyledFallback as AvatarFallback,
};
