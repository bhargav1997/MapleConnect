import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { createPost } from "../services/postService";
import { motion, AnimatePresence } from "framer-motion";
import { searchUsers } from "../services/userService";
import CreatePostForm from "./CreatePostForm";
import PrivacySelector from "./PrivacySelector";

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
   const { user } = useAuth();
   const [visibility, setVisibility] = useState("public");
   const [showPrivacySelector, setShowPrivacySelector] = useState(false);

   // If the modal is clicked outside, close it
   const modalRef = useRef(null);

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
         }
      };

      if (isOpen) {
         document.addEventListener("mousedown", handleClickOutside);
         // Prevent scrolling when modal is open
         document.body.style.overflow = "hidden";
      }

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
         // Re-enable scrolling when modal is closed
         document.body.style.overflow = "auto";
      };
   }, [isOpen, onClose]);

   // Handle successful post creation
   const handlePostCreated = () => {
      onPostCreated();
      onClose();
   };

   return (
      <Transition appear show={isOpen} as={Fragment}>
         <Dialog as='div' className='relative z-50' onClose={onClose}>
            <Transition.Child
               as={Fragment}
               enter='ease-out duration-300'
               enterFrom='opacity-0'
               enterTo='opacity-100'
               leave='ease-in duration-200'
               leaveFrom='opacity-100'
               leaveTo='opacity-0'>
               <div className='fixed inset-0 bg-black bg-opacity-25' />
            </Transition.Child>

            <div className='fixed inset-0 overflow-y-auto'>
               <div className='flex min-h-full items-center justify-center p-4 text-center'>
                  <Transition.Child
                     as={Fragment}
                     enter='ease-out duration-300'
                     enterFrom='opacity-0 scale-95'
                     enterTo='opacity-100 scale-100'
                     leave='ease-in duration-200'
                     leaveFrom='opacity-100 scale-100'
                     leaveTo='opacity-0 scale-95'>
                     <Dialog.Panel className='w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                        <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900 mb-4'>
                           Create Post
                        </Dialog.Title>
                        <CreatePostForm
                           onPostCreated={() => {
                              onPostCreated?.();
                              onClose();
                           }}
                           isInModal={true}
                        />
                     </Dialog.Panel>
                  </Transition.Child>
               </div>
            </div>
         </Dialog>
      </Transition>
   );
};

export default CreatePostModal;
