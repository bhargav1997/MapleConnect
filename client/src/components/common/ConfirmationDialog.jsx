import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";

const ConfirmationDialog = ({
   isOpen,
   title,
   message,
   onConfirm,
   onCancel,
   confirmText = "Confirm",
   cancelText = "Cancel",
   type = "danger",
}) => {
   if (!isOpen) return null;

   const getTypeStyles = () => {
      switch (type) {
         case "danger":
            return {
               icon: "text-red-500",
               button: "bg-red-500 hover:bg-red-600",
            };
         case "warning":
            return {
               icon: "text-yellow-500",
               button: "bg-yellow-500 hover:bg-yellow-600",
            };
         default:
            return {
               icon: "text-maple-red",
               button: "bg-maple-red hover:bg-maple-red/90",
            };
      }
   };

   const styles = getTypeStyles();

   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60'>
         <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className='w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden'>
            {/* Header */}
            <div className='p-6 flex items-start space-x-4'>
               <div className={`shrink-0 ${styles.icon}`}>
                  <FiAlertTriangle className='w-6 h-6' />
               </div>
               <div className='flex-1'>
                  <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
                  <p className='mt-2 text-sm text-gray-600'>{message}</p>
               </div>
            </div>

            {/* Footer */}
            <div className='px-6 py-4 bg-gray-50 flex justify-end space-x-3'>
               <button
                  onClick={onCancel}
                  className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red'>
                  {cancelText}
               </button>
               <button
                  onClick={onConfirm}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red ${styles.button}`}>
                  {confirmText}
               </button>
            </div>
         </motion.div>
      </motion.div>
   );
};

export default ConfirmationDialog;
