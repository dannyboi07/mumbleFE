import { styled } from "@stitches/react";
import { blackA } from "@radix-ui/colors";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as TabsPrimitive from "@radix-ui/react-tabs";

export const StyledRadio = styled(RadioGroupPrimitive.Item, {
	all: "unset",
	width: 25,
	height: 25,
	borderRadius: "100%",
	boxShadow: `0 2px 10px ${blackA.blackA8}`,

	"&:hover": {
		backgroundColor: blackA.blackA8,
	},

	"&:focus": {
		boxShadow: "0 0 0 2px black",
	},
});

export const StyledIndicator = styled(RadioGroupPrimitive.Indicator, {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: "100%",
	height: "100%",
	position: "relative",

	"&::after": {
		content: "''",
		display: "block",
		width: 11,
		height: 11,
		borderRadius: "50%",
	},
});

export const Box = styled("div", {
	variants: {
		color: {
			green: {
				backgroundColor: "black",
			},
		},
	},
});

export const RadioGroup = RadioGroupPrimitive.Root;
// export const RadioGroupRadio = StyledRadio;
// export const RadioGroupIndicator = StyledIndicator;

const StyledTabs = styled(TabsPrimitive.Root, {
	display: "flex",
	flexDirection: "column",
	width: 300,
});

const StyledList = styled(TabsPrimitive.List, {
	flexShrink: 0,
	display: "flex",
});

const StyledTrigger = styled(TabsPrimitive.Trigger, {
	all: "unset",
	fontFamily: "inherit",
	padding: "0 20px",
	height: 45,
	flex: 1,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	fontSize: 15,
	lineHeight: 1,
	userSelect: "none",
	"&:first-child": {
		borderTopLeftRadius: 6,
	},
	"&:last-child": {
		borderTopRightRadius: 6,
	},
});

const StyledContent = styled(TabsPrimitive.Content, {
	flex: 1,
	padding: 20,
	borderBottomLeftRadius: 6,
	borderBottomRightRadius: 6,
	outline: "none",
});

export { StyledTabs, StyledList, StyledTrigger, StyledContent };
