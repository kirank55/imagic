"use client"
import { useEffect, useState } from "react";
import UserContext from "./UserContext";

const UserContextProvider = ({ children }) => {

	const [userId, setUserId] = useState(null);

	// Fetch userId from /api/profile
	useEffect(() => {
		async function fetchUserId() {
			console.log("from fetchUserId");
			try {
				const res = await fetch("/api/profile");
				const data = await res.json();
				// console.log(data)
				if (data && data.userId) setUserId(data.userId);
			} catch (e) {
				console.error("Failed to fetch userId", e);
			}
		}
		fetchUserId();
	}, []);


	return (
		<UserContext.Provider value={{
			userId
		}}>
			{children}
		</UserContext.Provider>
	);
};

export default UserContextProvider;
