"use client"
import { useEffect, useState } from "react";
import fileContext from "./fileContext";

const fileContextProvider = ({ children }) => {

	const [UploadedFiles, setUploadedFiles] = useState([]);

	// const [ImagesUploadedtoBucket, setImagesUploadedtoBucket] = useState([]);
	// const [CompressionLevel, setCompressionLevel] = useState("high");
	// const [Compressedimages, setCompressedimages] = useState([]);
	// const [zipStatus, setZipStatus] = useState(false);
	const [userId, setUserId] = useState(null);

	useEffect(() => {
		console.log("from fcp", UploadedFiles);
	}, [UploadedFiles]);

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

	// Fetch images when userId is available
	// useEffect(() => {
	// 	if (!userId) return;
	// 	fetch(`/api/my-images?userId=${userId}`)
	// 		.then(res => res.json())
	// 		.then(data => {
	// 			console.log("from my-images", data);

	// 			if (data.success && Array.isArray(data.images)) {
	// 				setImagesUploadedtoBucket(data.images);
	// 			}
	// 		});
	// }, [userId, setImagesUploadedtoBucket]);


	return (
		<fileContext.Provider value={{
			UploadedFiles,
			setUploadedFiles,
			userId
		}}>
			{children}
		</fileContext.Provider>
	);
};

export default fileContextProvider;
