export const getUserInitials = (name) => {
   if (!name) return "M";
   const parts = name.split(" ");
   if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
   }
   return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};
