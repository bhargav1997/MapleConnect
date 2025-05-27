import { Link } from "react-router-dom";
import { useState } from "react";
import { getUserInitials } from "../../utils/helpers";
import defaultUserImage from "../../assets/default-user.png";


const UserAvatar = ({ user, size = "md", showLink = true, className = "", containerClassName = "" }) => {
   const [imageError, setImageError] = useState(false);

   const sizeClasses = {
      sm: "w-8 h-8 text-sm",
      md: "w-12 h-12 text-lg",
      lg: "w-16 h-16 text-xl",
      xl: "w-24 h-24 text-2xl",
   };

   const renderAvatar = () => {
      if (!user?.profileImage || imageError) {
         return <img src={defaultUserImage} alt={user?.name || "User"} className='w-full h-full object-cover' />;
      }

      return (
         <img
            src={user.profileImage}
            alt={user.name || "User"}
            className='w-full h-full object-cover'
            onError={() => setImageError(true)}
         />
      );
   };

   const avatarContent = (
      <div className={`${sizeClasses[size]} rounded-full bg-gray-100 overflow-hidden ${className}`}>{renderAvatar()}</div>
   );

   if (showLink && user?._id) {
      return (
         <Link to={`/profile/${user._id}`} className={`inline-block ${containerClassName}`}>
            {avatarContent}
         </Link>
      );
   }

   return <div className={containerClassName}>{avatarContent}</div>;
};

export default UserAvatar;
