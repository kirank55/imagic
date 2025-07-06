"use client";
import { useEffect, useState } from "react";
import myImageContext from "./myImageContext";
import { myImageType } from "@repo/ui/types/myImage";
import { useUserContext } from "context/UserContext/useUploadPageFileContext";

const MyImageContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [myImageFiles, setMyImageFiles] = useState<myImageType[]>([]);
  const [loading, setLoading] = useState(true);

  const userContext = useUserContext();
  const userId = userContext?.userId ?? "";

  useEffect(() => {
    async function fetchImages() {
      // If images are already loaded, we don't need to fetch again.
      if (myImageFiles.length > 0) {
        return;
      }

      // If there's no user ID, we are not ready to fetch.
      // We keep loading until the user context has been resolved.
      if (!userId) {
        // If the user context itself is still loading, we wait.
        // Otherwise, if we have no userId, we can stop loading.
        if (!userContext.loading) {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`/api/my-images?userId=${userId}`);
        const data = await res.json();

        if (data.success) {
          setMyImageFiles(data.images);
        } else {
          console.error("Failed to fetch images:", data.message);
          setMyImageFiles([]); // Clear images on failure
        }
      } catch (e) {
        console.error("An error occurred while fetching images", e);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, [userId, userContext.loading]);

  if (loading) {
    return <div>Loading... UserId</div>;
  }

  return (
    <myImageContext.Provider
      value={{
        myImageFiles,
        setMyImageFiles,
        userId,
      }}
    >
      {children}
    </myImageContext.Provider>
  );
};

export default MyImageContextProvider;
