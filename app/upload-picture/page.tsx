import AdminUploadPage from "@/components/forms/prof-picture-upload";
import PicturesStore from "@/components/prof-pics-test";
import ProfilePictureSelection from "@/components/set-prof-picture";
import React from "react";

const page = () => {
  return (
    <div className="flex w-full flex-col gap-8">
      <AdminUploadPage></AdminUploadPage>
      <PicturesStore></PicturesStore>
      <ProfilePictureSelection></ProfilePictureSelection>
    </div>
  );
};

export default page;
