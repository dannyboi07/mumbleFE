import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLazyAxios } from "../../hooks/useLazyAxios";
import { addContact, clearPendingMsgs } from "../../slices/contactsSlice";
import { setActiveContact } from "../../slices/contactsSlice";
import { selectRefresh } from "../../slices/refreshSlice";
import Contact from "./ContactList";
import { parseInitials } from "../../features/utils";

function Contacts({ searchContact }) {
	const dispatch = useDispatch();
	const refresh = useSelector(selectRefresh);
	const { lazyFetch, response, isLoading, error } = useLazyAxios({
		method: "GET",
		url: "/contacts",
		withCredentials: true,
	});

	useEffect(() => {
		if (!refresh) {
			lazyFetch();
		}
	}, [refresh]);

	useEffect(() => {
		if (response && !error) {
			const parsedResponse = response.contacts.map((contact) => {
				return {
					...contact,
					message: {
						text: "",
						count: 0,
					},
				};
			});
			dispatch(addContact(parsedResponse));
		}
	}, [response]);

	if (isLoading) {
		return (
			<div
				style={{
					width: "30%",
				}}
			>
				<h2>Loading...</h2>
			</div>
		);
	} else if (error) {
		return (
			<div
				style={{
					width: "30%",
				}}
			/>
		);
	}

	return (
		<>
			<hr />
			{response && searchContact !== ""
				? response.contacts
						.filter((contact) =>
							contact.name
								.toLowerCase()
								.includes(searchContact.toLowerCase()),
						)
						.map((contact) => {
							const nameInitials = parseInitials(contact.name);
							return (
								<Contact
									key={contact.user_id}
									contactId={contact.user_id}
									contactName={contact.name}
									nameInitials={nameInitials}
									contactProfPic={contact.profile_pic}
									onClick={() => {
										dispatch(
											setActiveContact(contact.user_id),
										);
										dispatch(
											clearPendingMsgs(contact.user_id),
										);
									}}
								/>
							);
						})
				: response.contacts.map((contact) => {
						const nameInitials = parseInitials(contact.name);
						return (
							<Contact
								key={contact.user_id}
								contactId={contact.user_id}
								contactName={contact.name}
								nameInitials={nameInitials}
								contactProfPic={contact.profile_pic}
								onClick={() => {
									dispatch(setActiveContact(contact.user_id));
									dispatch(clearPendingMsgs(contact.user_id));
								}}
							/>
						);
				  })}
		</>
	);
}

export default Contacts;
