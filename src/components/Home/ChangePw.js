import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	Box,
	StyledTabs,
	StyledContent,
	StyledList,
	StyledTrigger,
} from "../../stitches-components/menuStyled";
import {
	StyledInput,
	Avatar,
	AvatarImage,
	AvatarFallback,
} from "../../stitches-components/commonStyled";
import { styled } from "@stitches/react";
import { blackA, mauve } from "@radix-ui/colors";
import { useLazyAxios } from "../../hooks/useLazyAxios";
import { parseInitials } from "../../features/utils";
import { selectUser, setUser } from "../../slices/userSlice";
import { setToast } from "../../slices/toastSlice";

const StyledForm = styled("form", {
	height: "350px",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-around",

	"& > label > input": {
		height: 35,
		marginTop: "0.25em",
		padding: "0 0.5em",
		borderRadius: "0.25rem",
		border: 0,
		boxShadow: "0 0 0 1px gray",
		transition: "box-shadow 0.15s ease-in-out",

		"&:hover": {
			boxShadow: "0 0 0 1px black",
		},

		"&:focus": {
			outline: "none",
			boxShadow: "0 0 0 2px black",
		},
	},
});

const StyledProfPicChange = styled("div", {
	marginTop: "1em",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	flexDirection: "column",

	"& > span": {
		"& > form": {
			position: "absolute",
			width: 275,
			height: 275,
			backgroundColor: blackA.blackA10,
			borderRadius: "100%",
			visibility: "hidden",
			opacity: 0,
			transition: "opacity 0.25s",

			"& > label": {
				width: 275,
				height: 275,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				border: "1px solid black",
				borderRadius: "inherit",
				cursor: "inherit",

				"& > input": {
					display: "none",
				},
			},
		},

		"&:hover": {
			"& > form": {
				cursor: "pointer",
				visibility: "visible",
				opacity: 1,
			},
		},
	},

	"& > button": {
		fontSize: "0.875rem",
		marginTop: "1em",
		padding: "0.75em 1em",
		borderRadius: "0.25em",
		border: 0,

		"&:hover": {
			cursor: "pointer",
		},
	},
});

const StyledButton = styled("button", {
	fontSize: "0.925rem",
	width: "fit-content",
	padding: "0.65em 1em",
	alignSelf: "center",
	borderRadius: "0.25rem",
	border: 0,

	"&:hover": {
		cursor: "pointer",
	},
});

function ChangePw() {
	const dispatch = useDispatch();
	const theme = useSelector((state) => state.theme);
	const userDetails = useSelector(selectUser);

	const [newDp, setNewDp] = useState(null);
	const [newDpDisplay, setNewDpDisplay] = useState(userDetails.profile_pic);
	const [changePw, setChangePw] = useState({
		curPw: "",
		newPw: "",
		confirmPw: "",
	});

	const { lazyFetch: lazyFetchPw } = useLazyAxios({
		url: "/changePw",
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		withCredentials: true,
		data: JSON.stringify({
			password: changePw.curPw,
			new_pw: changePw.newPw,
		}),
	});

	function handleChange(e) {
		setChangePw({ ...changePw, [e.target.name]: e.target.value });
	}

	function handleSubmit(e) {
		e.preventDefault();
		lazyFetchPw();
	}

	function handleNewDpSubmit(e) {
		e.preventDefault();
		if (newDp) {
			if (!newDp.type) {
				dispatch(
					setToast({
						type: "info",
						title: "File type not accepted",
						message:
							"You can use images of type jpg, png, heif/heic, or gifs!",
					}),
				);
				return;
			}
			if (
				!/^jpg|jpeg|png|heif|heic|gif$/.test(newDp.type.split("/")[1])
			) {
				dispatch(
					setToast({
						type: "info",
						title: "File type not accepted",
						message:
							"You can use images of type jpg, png, heif/heic, or gifs!",
					}),
				);
				return;
			} else {
				const newDpForm = new FormData();
				newDpForm.append("profilePic", newDp);

				fetch(
					`https://${process.env.REACT_APP_BACKEND_DOM_API}/changeDp`,
					{
						method: "PUT",
						body: newDpForm,
						credentials: "include",
					},
				).then((data) => {
					if (data.status !== 200) {
						data.text().then((message) => {
							dispatch(
								setToast({
									type: "err",
									title: message,
								}),
							);
						});
					} else {
						data.json().then((res) => {
							const newUserDetails = {
								...userDetails,
								profile_pic: res.profile_pic,
							};
							dispatch(setUser(newUserDetails));
							localStorage.setItem(
								"mumble-user",
								JSON.stringify(newUserDetails),
							);
						});
						dispatch(
							setToast({
								type: "suc",
								title: "Profile picture changed",
							}),
						);
					}
				});
			}
		} else {
			dispatch(
				setToast({
					type: "err",
					title: "Select a new image",
				}),
			);
		}
	}

	const TabsTrigger = styled(StyledTrigger, {
		color: mauve.mauve11,
		"&:hover": {
			color: theme.contrast ? "black" : "white",
		},
		"&[data-state='active']": {
			color: theme.contrast ? "black" : "white",
			boxShadow: "inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor",
		},
		"&:focus": {
			position: "relative",
			boxShadow: `0 0 0 2px ${theme.contrast ? "black" : "white"}`,
		},
	});

	const Button = styled(StyledButton, {
		backgroundColor: theme.accCol,
		color: theme.contrast ? "white" : "black",
	});

	return (
		<StyledTabs defaultValue="tab1">
			<StyledList
				css={{
					borderBottom: `1px solid ${
						theme.contrast ? blackA.blackA12 : mauve.mauve6
					}`,
				}}
			>
				<TabsTrigger value="tab1">Profile Image</TabsTrigger>

				<TabsTrigger value="tab2">Password</TabsTrigger>
			</StyledList>

			<StyledContent value="tab1">
				<p
					style={{
						textAlign: "center",
					}}
				>
					Change your profile picture
				</p>
				<StyledProfPicChange>
					{userDetails && (
						<>
							<Avatar
								css={{
									width: 275,
									height: 275,
								}}
							>
								<form
									id="new-dp-form"
									onSubmit={handleNewDpSubmit}
									encType="multipart/form-data"
								>
									<label>
										<svg
											width="30"
											height="30"
											viewBox="0 0 15 15"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M3.5 2C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V6H8.5C8.22386 6 8 5.77614 8 5.5V2H3.5ZM9 2.70711L11.2929 5H9V2.70711ZM2 2.5C2 1.67157 2.67157 1 3.5 1H8.5C8.63261 1 8.75979 1.05268 8.85355 1.14645L12.8536 5.14645C12.9473 5.24021 13 5.36739 13 5.5V12.5C13 13.3284 12.3284 14 11.5 14H3.5C2.67157 14 2 13.3284 2 12.5V2.5Z"
												fill="white"
												fillRule="evenodd"
												clipRule="evenodd"
											></path>
										</svg>

										<input
											type="file"
											onChange={(e) => {
												setNewDp(e.target.files[0]);
												URL.revokeObjectURL(
													newDpDisplay,
												);
												setNewDpDisplay(
													URL.createObjectURL(
														e.target.files[0],
													),
												);
											}}
										/>
									</label>
								</form>
								<AvatarImage src={newDpDisplay} alt={""} />
								<AvatarFallback
									css={{
										fontSize: "2rem",
									}}
									delayMs={500}
								>
									{parseInitials(userDetails.name)}
								</AvatarFallback>
							</Avatar>
							{userDetails.profile_pic !== newDpDisplay && (
								<Button
									form="new-dp-form"
									type="submit"
									style={{
										backgroundColor: theme.accCol,
									}}
									title="Change profile picture"
								>
									Change
								</Button>
							)}
						</>
					)}
				</StyledProfPicChange>
			</StyledContent>

			<StyledContent value="tab2">
				<Box>
					<StyledForm onSubmit={handleSubmit}>
						{/* <label>
							Email:
							<StyledInput
								key="email"
								name="email"
								type="email"
								value={changePw.email}
								onChange={handleChange}
								required
							/>
						</label> */}
						<label>
							Current Password:
							<StyledInput
								key="curPw"
								name="curPw"
								type="password"
								value={changePw.curPw}
								onChange={handleChange}
								required
							/>
						</label>
						<label>
							New Password:
							<StyledInput
								key="newPw"
								name="newPw"
								type="password"
								value={changePw.newPw}
								onChange={handleChange}
								required
							/>
						</label>
						<label>
							Confirm Password:
							<StyledInput
								key="confirmPw"
								name="confirmPw"
								type="password"
								value={changePw.confirmPw}
								onChange={handleChange}
								required
							/>
						</label>
						<Button
							css={{
								backgroundColor: theme.accCol,
								color: theme.contrast ? "white" : "black",
							}}
							type="submit"
						>
							Change Password
						</Button>
					</StyledForm>
				</Box>
			</StyledContent>
		</StyledTabs>
	);
}

export default ChangePw;
