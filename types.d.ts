// User | Contact
interface BaseUser {
    userId: number | string;
    name: string;
    profilePic: string | null;
}

interface User extends BaseUser {
    email: string;
}

interface Contact extends BaseUser {}

// Theme
type ThemeType = "light" | "dark" | "custom";

type PrimaryColour = "#FAF9F9" | "#0B3954";
type SecondaryColour = "#C9E4CA" | "#087E8B";
type AccColour = "#55828B" | "#BFD7EA";

interface BaseTheme {
    type: ThemeType;
    contrast: boolean;
}

interface Theme extends BaseTheme {
    primCol: PrimaryColour;
    secCol: SecondaryColour;
    accCol: AccColour;
}

type CustomHexColour = `#${string}`;

interface CustomTheme extends BaseTheme {
    primCol: CustomHexColour;
    secCol: CustomHexColour;
    accCol: CustomHexColour;
}

interface BaseMessage {
    from: number;
    to: number;
    text: string;
    time: Date;
}

interface Message extends BaseMessage {
    id: number;
}

interface BaseMessageWebsocket extends BaseMessage {
    uuid: string;
    status: string;
}

type MessageWebsocketOutput = BaseMessageWebsocket;

// interface MessageWebsocketInput extends BaseMessageWebsocket, Message {}
type MessageWebsocketInput = BaseMessageWebsocket & Message;
