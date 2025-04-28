"use client";

import React, { useState, useEffect, useRef } from "react";
import "./navbar.css";
import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  X,
  Paperclip,
  ArrowLeft,
  CheckCircle,
  Search,
  PlusCircle,
  MinusCircle,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
  LogOut,
} from "lucide-react";
import ChatBot from "../chat/ChatBot";
import Portal from "../components/Portal";
import LogoutIcon from "../components/icons/LogoutIcon";
import { useAuth } from "@/src/hooks/useAuth";
import Loader from "../components/animation/loader";


const Navbar = () => {
  const [notificationCount] = useState(1);
  const [isBotModalOpen, setIsBotModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [recordingTime, setRecordingTime] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  type NotificationAttachmentType = {
    file: File;
    preview: string;
    id: string;
  };
  const [notificationAttachments, setNotificationAttachments] = useState<
    NotificationAttachmentType[]
  >([]);
  const notificationFileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [viewingNotificationDetail, setViewingNotificationDetail] =
    useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<"loading" | "success">("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitModalMessage, setLimitModalMessage] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(-1);

  // Hook d'auth pour la déconnexion
  const { logout: handleLogout, isLogoutLoading } = useAuth();

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsBotModalOpen(false);
        setIsNotifModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscapeKey);
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  useEffect(() => {
    if (isBotModalOpen || isNotifModalOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [isBotModalOpen, isNotifModalOpen]);

  const notifications = [
    {
      id: 1,
      title: "Vérification pièces d'identité",
      message: "Votre pièce d'identité est en cours de vérif...",
      time: "04/09/2024 13:50",
      date: "Hier",
      icon: "document",
      read: true,
      hasReply: false,
    },
    {
      id: 2,
      title: "Vérification pièces d'identité",
      message: "Votre pièce d'identité a été validée retrou...",
      time: "06/09/2024 13:50",
      date: "Aujourd'hui",
      icon: "document",
      read: false,
      hasReply: true,
    },
    // ...
    // Ajoutez ou modifiez vos notifications ici
  ];

  const groupedNotifications = notifications.reduce(
    (acc: { [key: string]: any[] }, notification) => {
      if (!acc[notification.date]) {
        acc[notification.date] = [];
      }
      acc[notification.date].push(notification);
      return acc;
    },
    {}
  );

  return (
    <>
      {/* Navbar container */}
      <div className="px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between mt-6 relative z-10 ">
        {/* Left side */}
        <div className="flex items-center gap-2 sm:gap-8">
          <Link
            href="/"
            className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-50 to-white border border-gray-200 shadow-sm hover:shadow rounded-xl text-xs font-semibold sm:text-sm text-gray-800 hover:text-gray-900 hover:border-gray-300 gap-2.5 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 sm:w-5 sm:h-5 text-[#F7942E]"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.1663 18.7172C17.9236 15.9794 15.932 14.4259 14.1915 14.0568C12.4511 13.6877 10.794 13.6319 9.22042 13.8895V18.7923L1.83301 10.7921L9.22042 3.20898V7.86886C12.1302 7.89178 14.604 8.93571 16.6418 11.0007C18.6792 13.0656 19.8541 15.6378 20.1663 18.7172Z"
                fill="#F7942E"
                stroke="#F7942E"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-medium">Retour au site</span>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center pr-2 sm:pr-4 lg:pr-6 ">
          <div className="flex items-center gap-3">
            {/* Notifications icon */}
            <div
              className="relative w-[40px] sm:w-[50px] h-[40px] sm:h-[50px] bg-white border border-gray-200 shadow-sm rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50 hover:shadow transition-all duration-200 transform hover:-translate-y-0.5"
              onClick={() => setIsNotifModalOpen(true)}
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-[#4ECDC4]" />
              {notificationCount > 0 && (
                <span
                  className="absolute flex items-center justify-center min-w-[20px] h-[20px] px-[6px] rounded-full bg-gradient-to-r from-[#FFBE20] to-[#FFA41B] text-white shadow-sm"
                  style={{
                    top: "-6px",
                    right: "-6px",
                  }}
                >
                  <span className="text-[10px] font-bold">
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </span>
                </span>
              )}
            </div>
            {/* Logout button */}
            <div
              className="relative w-[40px] sm:w-[50px] h-[40px] sm:h-[50px] bg-white border border-gray-200 shadow-sm rounded-xl flex items-center justify-center cursor-pointer hover:bg-red-50 hover:shadow transition-all duration-200 transform hover:-translate-y-0.5"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <LogoutIcon className="h-4 w-4 sm:h-5 sm:w-5" color="#EC4F48" />
            </div>


          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <Portal>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
            <div className="bg-white rounded-2xl p-6 max-w-xs w-full mx-4 relative overflow-hidden zoom-in">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-yellow-500"></div>
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <LogoutIcon className="w-6 h-6" color="#EC4F48" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-center mb-2">
                Confirmer la déconnexion
              </h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Êtes-vous sûr de vouloir vous déconnecter de votre compte ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-xl text-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={async () => {
                    setShowLogoutConfirm(false);
                    setIsLoading(true);
                    try {
                      await handleLogout();
                    } catch (error) {
                      console.error("Erreur lors de la déconnexion:", error);
                      window.location.href = "/";
                    }
                  }}
                  className="flex-1 py-2 px-4 bg-rouge text-white rounded-xl text-sm font-medium"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* Notifications Slide-in Modal */}
      {isNotifModalOpen && (
        <Portal>
          <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 z-[999999999]"
            onClick={(e) => {
              e.preventDefault();
              console.log("Overlay clicked, closing Notifications");
              setIsNotifModalOpen(false);
            }}
          >
            <div
              className={`fixed top-0 right-0 h-full w-full sm:w-[500px] md:w-[600px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out rounded-l-2xl overflow-hidden z-[9999999999] ${isNotifModalOpen ? "translate-x-0" : "translate-x-full"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full relative">
                {!viewingNotificationDetail ? (
                  <>
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white shadow-sm">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-[#4ECDC4]/10 flex items-center justify-center mr-3 border border-[#4ECDC4]/20">
                          <Bell size={18} className="text-[#4ECDC4]" />
                        </div>
                        <h2 className="font-semibold text-lg text-gray-800">
                          Boîte de réception
                        </h2>
                      </div>
                      <button
                        className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-xl flex items-center justify-center transition-all duration-200"
                        style={{ minWidth: "40px", minHeight: "40px" }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log(
                            "Close button clicked, closing Notifications"
                          );
                          setIsNotifModalOpen(false);
                        }}
                        aria-label="Fermer la boîte de réception"
                      >
                        <X size={20} strokeWidth={2} />
                      </button>
                    </div>

                    {/* Notifications list (no body scroll, but here can make container auto or hidden) */}
                    <div className="flex-1 overflow-auto p-3 sm:p-5 bg-gray-50/50">
                      {Object.keys(groupedNotifications).map((date) => (
                        <div key={date} className="mb-6">
                          <div className="flex items-center mb-4 mt-2">
                            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                            <h3 className="font-semibold text-xs sm:text-sm text-[#4ECDC4] px-4 py-1.5 rounded-xl bg-[#4ECDC4]/10 mx-3 shadow-sm border border-[#4ECDC4]/20">
                              {date}
                            </h3>
                            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                          </div>
                          {groupedNotifications[date].map((notification) => (
                            <div
                              key={notification.id}
                              className={`
                            mb-3 p-4 bg-white rounded-xl relative cursor-pointer hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow
                            transform hover:-translate-y-0.5
                          `}
                              onClick={() => {
                                setSelectedNotification(notification);
                                setViewingNotificationDetail(true);
                              }}
                            >
                              <div className="flex">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 flex-shrink-0">
                                  {notification.icon === "document" ? (
                                    <div className="bg-gradient-to-br from-[#4ECDC4]/20 to-[#4ECDC4]/10 border border-[#4ECDC4]/30 rounded-xl w-full h-full flex items-center justify-center shadow-inner overflow-hidden">
                                      <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="drop-shadow-sm"
                                      >
                                        <path
                                          d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                                          stroke="#4ECDC4"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M14 2V8H20"
                                          stroke="#4ECDC4"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M16 13H8"
                                          stroke="#4ECDC4"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M16 17H8"
                                          stroke="#4ECDC4"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>
                                  ) : (
                                    <div className="bg-gradient-to-br from-orange-200 to-orange-100 border border-orange-200 rounded-xl w-full h-full flex items-center justify-center shadow-inner overflow-hidden">
                                      <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="drop-shadow-sm"
                                      >
                                        <path
                                          d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                          stroke="#F97316"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-sm sm:text-base text-gray-800">
                                      {notification.title}
                                    </h4>
                                    {!notification.read ? (
                                      <div className="flex items-center px-2 py-1 bg-[#4ECDC4]/10 rounded-full">
                                        <div className="w-2 h-2 rounded-full bg-[#4ECDC4] mr-1" />
                                        <span className="text-[10px] font-medium text-[#4ECDC4]">
                                          Nouveau
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="text-[10px] text-gray-400 font-medium">
                                        Lu
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-sm sm:text-base text-gray-600 my-2 leading-relaxed">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center text-[11px] sm:text-xs text-gray-500 mt-2">
                                    <Clock size={12} className="mr-1" />
                                    {notification.time}
                                  </div>

                                  {notification.hasReply && (
                                    <div className="mt-3 flex justify-end">
                                      <button className="bg-gradient-to-r from-[#4ECDC4] to-[#2BB5AA] text-white rounded-xl px-4 py-2 flex items-center justify-center gap-2 text-xs sm:text-sm shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5">
                                        <svg
                                          width="16"
                                          height="16"
                                          viewBox="0 0 20 20"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M5.68717 10.0007L8.10384 12.4173C8.27051 12.584 8.35051 12.7784 8.34384 13.0007C8.33717 13.2229 8.25023 13.4173 8.08301 13.584C7.91634 13.7368 7.7219 13.8168 7.49967 13.824C7.27745 13.8312 7.08301 13.7512 6.91634 13.584L3.08301 9.75065C2.91634 9.58398 2.83301 9.38954 2.83301 9.16732C2.83301 8.9451 2.91634 8.75065 3.08301 8.58398L6.91634 4.75065C7.06912 4.59787 7.26023 4.52148 7.48967 4.52148C7.71912 4.52148 7.9169 4.59787 8.08301 4.75065C8.24967 4.91732 8.33301 5.11537 8.33301 5.34482C8.33301 5.57426 8.24967 5.77204 8.08301 5.93815L5.68717 8.33398H13.333C14.4858 8.33398 15.4686 8.74037 16.2813 9.55315C17.0941 10.3659 17.5002 11.3484 17.4997 12.5007V15.0007C17.4997 15.2368 17.4197 15.4348 17.2597 15.5948C17.0997 15.7548 16.9019 15.8345 16.6663 15.834C16.4308 15.8334 16.233 15.7534 16.073 15.594C15.913 15.4345 15.833 15.2368 15.833 15.0007V12.5007C15.833 11.8062 15.59 11.2159 15.1038 10.7298C14.6177 10.2437 14.0275 10.0007 13.333 10.0007H5.68717Z"
                                            fill="white"
                                          />
                                        </svg>
                                        Répondre
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-[#4ECDC4]/10 to-white">
                      <div className="flex items-center">
                        <button
                          className="p-2 hover:bg-gray-100 rounded-full mr-3 text-gray-600 transition-colors duration-200"
                          onClick={() => {
                            setViewingNotificationDetail(false);
                            setSelectedNotification(null);
                          }}
                        >
                          <ArrowLeft size={18} strokeWidth={2.5} />
                        </button>
                        <h2 className="font-semibold text-lg text-gray-800">
                          Détail de la notification
                        </h2>
                      </div>
                      <button
                        className="p-2 text-gray-500 hover:bg-gray-100 hover:text-red-500 rounded-full flex items-center justify-center transition-colors duration-200"
                        style={{ minWidth: "40px", minHeight: "40px" }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log(
                            "Close button clicked in detail view, closing Notifications"
                          );
                          setIsNotifModalOpen(false);
                          setViewingNotificationDetail(false);
                          setSelectedNotification(null);
                        }}
                        aria-label="Fermer la boîte de réception"
                      >
                        <X size={20} strokeWidth={2} />
                      </button>
                    </div>

                    {selectedNotification && (
                      <div className="flex-1 overflow-auto p-4 sm:p-6 bg-gray-50/50">
                        <div className="bg-white rounded-xl shadow p-5 sm:p-6 border border-gray-100">
                          <div className="flex items-start mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 flex-shrink-0">
                              {selectedNotification.icon === "document" ? (
                                <div className="border border-gray-300 rounded-full w-full h-full flex items-center justify-center">
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                                      stroke="#111827"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M16 13H8"
                                      stroke="#111827"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M16 17H8"
                                      stroke="#111827"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M10 9L9H8"
                                      stroke="#111827"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </div>
                              ) : (
                                <div className="bg-gray-300 rounded-full w-full h-full flex items-center justify-center overflow-hidden">
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M6 18L18 6M18 18L6 6"
                                      stroke="#111827"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-base sm:text-lg">
                                  {selectedNotification.title}
                                </h3>
                                <span className="text-xs sm:text-sm text-gray-500">
                                  {selectedNotification.time}
                                </span>
                              </div>
                              <div className="text-xs sm:text-sm text-gray-500 mb-1">
                                {selectedNotification.date}
                              </div>
                              <div className="mt-4 bg-gray-50 p-4 rounded-lg text-sm sm:text-base">
                                {/* Version complète du message au lieu du message tronqué */}
                                <p>
                                  {selectedNotification.message.replace(
                                    "retrou...",
                                    "retrouvez-la dans votre espace client. Vous pouvez désormais accéder à tous les services nécessitant une vérification d'identité."
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>

                          {selectedNotification.hasReply && !isReplying && (
                            <div className="mt-6 flex justify-end">
                              <button
                                className="bg-[#4ECDC4] text-white rounded-[10px] px-6 py-3 flex items-center justify-center gap-2 text-sm sm:text-base"
                                onClick={() => setIsReplying(true)}
                              >
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.68717 10.0007L8.10384 12.4173C8.27051 12.584 8.35051 12.7784 8.34384 13.0007C8.33717 13.2229 8.25023 13.4173 8.08301 13.584C7.91634 13.7368 7.7219 13.8168 7.49967 13.824C7.27745 13.8312 7.08301 13.7512 6.91634 13.584L3.08301 9.75065C2.91634 9.58398 2.83301 9.38954 2.83301 9.16732C2.83301 8.9451 2.91634 8.75065 3.08301 8.58398L6.91634 4.75065C7.06912 4.59787 7.26023 4.52148 7.48967 4.52148C7.71912 4.52148 7.9169 4.59787 8.08301 4.75065C8.24967 4.91732 8.33301 5.11537 8.33301 5.34482C8.33301 5.57426 8.24967 5.77204 8.08301 5.93815L5.68717 8.33398H13.333C14.4858 8.33398 15.4686 8.74037 16.2813 9.55315C17.0941 10.3659 17.5002 11.3484 17.4997 12.5007V15.0007C17.4997 15.2368 17.4197 15.4348 17.2597 15.5948C17.0997 15.7548 16.9019 15.8345 16.6663 15.834C16.4308 15.8334 16.233 15.7534 16.073 15.594C15.913 15.4345 15.833 15.2368 15.833 15.0007V12.5007C15.833 11.8062 15.59 11.2159 15.1038 10.7298C14.6177 10.2437 14.0275 10.0007 13.333 10.0007H5.68717Z"
                                    fill="white"
                                  />
                                </svg>
                                Répondre
                              </button>
                            </div>
                          )}

                          {selectedNotification.hasReply && isReplying && (
                            <div className="mt-6 border-t pt-4">
                              <div className="mb-3">
                                <h4 className="font-medium text-sm mb-2">
                                  Votre réponse
                                </h4>
                                <textarea
                                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
                                  rows={4}
                                  placeholder="Saisissez votre réponse ici..."
                                  value={replyMessage}
                                  onChange={(e) => setReplyMessage(e.target.value)}
                                ></textarea>

                                {/* Prévisualisation des pièces jointes */}
                                {notificationAttachments.length > 0 && (
                                  <div className="mt-3 space-y-2">
                                    {notificationAttachments.map((attachment) => (
                                      <div
                                        key={attachment.id}
                                        className="relative bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg p-2 flex items-center"
                                      >
                                        {attachment.file.type.startsWith(
                                          "image/"
                                        ) ? (
                                          <div
                                            className="relative w-16 h-16 mr-3 cursor-pointer overflow-hidden rounded-md group thumbnail-hover"
                                            onClick={() => {
                                              setPreviewImage(attachment.preview);
                                              // Trouver l'index de cette image dans le tableau des pièces jointes
                                              const index =
                                                notificationAttachments.findIndex(
                                                  (item) =>
                                                    item.id === attachment.id
                                                );
                                              setCurrentImageIndex(index);
                                            }}
                                          >
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all duration-200">
                                              <div className="text-white opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-200">
                                                <Search size={20} />
                                              </div>
                                            </div>
                                            <img
                                              src={attachment.preview}
                                              alt="Aperçu"
                                              className="w-16 h-16 object-cover rounded-md"
                                            />
                                          </div>
                                        ) : (
                                          <div className="bg-gray-200 rounded-md p-2 mr-3">
                                            {attachment.file.type.includes(
                                              "pdf"
                                            ) ? (
                                              <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
                                                  fill="#FF5252"
                                                  fillOpacity="0.2"
                                                  stroke="#FF5252"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                                <path
                                                  d="M16 13H12"
                                                  stroke="#FF5252"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                                <path
                                                  d="M16 9H12"
                                                  stroke="#FF5252"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                                <path
                                                  d="M4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6Z"
                                                  fill="#FF5252"
                                                  fillOpacity="0.2"
                                                  stroke="#FF5252"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                              </svg>
                                            ) : attachment.file.type.includes(
                                              "word"
                                            ) ||
                                              attachment.file.type.includes(
                                                "doc"
                                              ) ? (
                                              <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                                                  fill="#4285F4"
                                                  fillOpacity="0.2"
                                                  stroke="#4285F4"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                                <path
                                                  d="M14 2V8H20"
                                                  stroke="#4285F4"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                                <path
                                                  d="M9 13H15"
                                                  stroke="#4285F4"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                                <path
                                                  d="M9 17H15"
                                                  stroke="#4285F4"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                                <path
                                                  d="M9 9H10"
                                                  stroke="#4285F4"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                              </svg>
                                            ) : attachment.file.type.includes(
                                              "text"
                                            ) ||
                                              attachment.file.type.includes(
                                                "txt"
                                              ) ? (
                                              <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                                                  fill="#34A853"
                                                  fillOpacity="0.2"
                                                  stroke="#34A853"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                                <path
                                                  d="M14 2V8H20"
                                                  stroke="#34A853"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                                <path
                                                  d="M16 13H8"
                                                  stroke="#34A853"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                                <path
                                                  d="M16 17H8"
                                                  stroke="#34A853"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                                <path
                                                  d="M10 9H8"
                                                  stroke="#34A853"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                              </svg>
                                            ) : (
                                              <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                                                  fill="#4B5563"
                                                  fillOpacity="0.2"
                                                  stroke="#4B5563"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                                <path
                                                  d="M14 2V8H20"
                                                  stroke="#4B5563"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                                <path
                                                  d="M16 13H8"
                                                  stroke="#4B5563"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                                <path
                                                  d="M16 17H8"
                                                  stroke="#4B5563"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                                <path
                                                  d="M10 9H9H8"
                                                  stroke="#4B5563"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                              </svg>
                                            )}
                                          </div>
                                        )}
                                        <div className="flex-1">
                                          <p className="text-sm font-medium truncate">
                                            {attachment.file.name}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {(attachment.file.size / 1024).toFixed(
                                              2
                                            )}{" "}
                                            KB
                                          </p>
                                        </div>
                                        <button
                                          className="p-1 hover:bg-gray-200 rounded-full"
                                          onClick={() => {
                                            setNotificationAttachments((prev) =>
                                              prev.filter(
                                                (item) => item.id !== attachment.id
                                              )
                                            );
                                          }}
                                        >
                                          <X size={16} />
                                        </button>
                                      </div>
                                    ))}

                                    {/* Compteur de fichiers */}
                                    <div className="text-xs text-gray-500">
                                      {notificationAttachments.length} fichier
                                      {notificationAttachments.length > 1
                                        ? "s"
                                        : ""}{" "}
                                      joint
                                      {notificationAttachments.length > 1
                                        ? "s"
                                        : ""}{" "}
                                      (maximum 5)
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex justify-between items-center mt-4">
                                <div>
                                  <input
                                    type="file"
                                    ref={notificationFileInputRef}
                                    className="hidden"
                                    multiple
                                    onChange={(e) => {
                                      const files = e.target.files;
                                      if (files && files.length > 0) {
                                        // Convertir FileList en Array pour pouvoir le manipuler
                                        const filesArray = Array.from(files);

                                        // Vérifier si on ne dépasse pas la limite de 5 fichiers
                                        if (
                                          notificationAttachments.length +
                                          filesArray.length >
                                          5
                                        ) {
                                          const remainingSlots =
                                            5 - notificationAttachments.length;
                                          // Afficher le modal au lieu d'une alerte
                                          setLimitModalMessage(
                                            `Vous ne pouvez pas joindre plus de 5 fichiers au total.`
                                          );
                                          setShowLimitModal(true);

                                          // Si on peut encore ajouter des fichiers, on prend seulement le nombre restant
                                          if (remainingSlots <= 0) {
                                            e.target.value = "";
                                            return;
                                          }

                                          // Limiter le nombre de fichiers à traiter
                                          filesArray.splice(remainingSlots);
                                        }

                                        // Traiter chaque fichier sélectionné
                                        filesArray.forEach((file) => {
                                          // Créer une URL pour la prévisualisation
                                          const fileReader = new FileReader();
                                          fileReader.onload = (e) => {
                                            if (e.target?.result) {
                                              const newAttachment = {
                                                file: file,
                                                preview: e.target.result as string,
                                                id: `attachment-${Date.now()}-${Math.random()
                                                  .toString(36)
                                                  .substr(2, 9)}`,
                                              };

                                              setNotificationAttachments((prev) => [
                                                ...prev,
                                                newAttachment,
                                              ]);
                                            }
                                          };
                                          fileReader.readAsDataURL(file);
                                        });

                                        // Réinitialiser l'input file pour permettre de sélectionner à nouveau les mêmes fichiers
                                        e.target.value = "";
                                      }
                                    }}
                                    accept="image/*,.pdf,.doc,.docx,.txt"
                                  />
                                  <button
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    onClick={() =>
                                      notificationFileInputRef.current?.click()
                                    }
                                    disabled={
                                      isSubmitting ||
                                      notificationAttachments.length >= 5
                                    }
                                  >
                                    <Paperclip size={16} />
                                    <span>Joindre un fichier</span>
                                  </button>
                                </div>

                                {/* Boutons Annuler et Envoyer */}
                                <div className="flex gap-3">
                                  <button
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                                    onClick={() => {
                                      setIsReplying(false);
                                      setReplyMessage("");
                                      setNotificationAttachments([]);
                                    }}
                                    disabled={isSubmitting}
                                  >
                                    Annuler
                                  </button>
                                  <button
                                    className="px-4 py-2 bg-[#4ECDC4] text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={
                                      (!replyMessage.trim() &&
                                        notificationAttachments.length === 0) ||
                                      isSubmitting
                                    }
                                    onClick={() => {
                                      // Afficher le toast de chargement
                                      setToastType("loading");
                                      setShowToast(true);
                                      setIsSubmitting(true);

                                      // Simuler l'envoi de la réponse (délai artificiel pour démonstration)
                                      console.log(
                                        "Envoi de la réponse en cours:",
                                        replyMessage
                                      );
                                      if (notificationAttachments.length > 0) {
                                        console.log(
                                          `Avec ${notificationAttachments.length} pièce(s) jointe(s):`
                                        );
                                        notificationAttachments.forEach(
                                          (attachment) => {
                                            console.log(
                                              `- ${attachment.file.name} (${(
                                                attachment.file.size / 1024
                                              ).toFixed(2)} KB)`
                                            );
                                          }
                                        );
                                      }

                                      // Simuler un délai réseau
                                      setTimeout(() => {
                                        // Réinitialiser l'état après "envoi"
                                        setIsReplying(false);
                                        setReplyMessage("");
                                        setNotificationAttachments([]);
                                        setIsSubmitting(false);

                                        // Changer pour le toast de succès
                                        setToastType("success");

                                        // Masquer le toast après 3 secondes
                                        setTimeout(() => {
                                          setShowToast(false);
                                        }, 3000);
                                      }, 1500); // Délai simulé de 1.5 secondes
                                    }}
                                  >
                                    Envoyer
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* Toast dynamique (chargement ou confirmation) */}
      <div
        className={`fixed top-4 right-4 bg-white backdrop-blur-sm bg-opacity-95 shadow-xl rounded-lg overflow-hidden transition-all duration-500 ease-in-out z-[10000] ${showToast
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-[-30px] opacity-0 pointer-events-none"
          }`}
        style={{ boxShadow: "0 8px 20px rgba(0, 0, 0, 0.12)" }}
      >
        {/* Barre de progression animée en haut du toast (visible uniquement pendant le chargement) */}
        {toastType === "loading" && (
          <div className="h-1 bg-gradient-to-r from-green-400 via-[#4ECDC4] to-green-400 w-full">
            <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          </div>
        )}

        <div className="p-4 flex items-center gap-4">
          {toastType === "loading" ? (
            <>
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-green-400 bg-opacity-20 rounded-full animate-ping"></div>
                <div className="relative bg-gradient-to-tr from-green-500 to-[#4ECDC4] p-3 rounded-full flex items-center justify-center z-10">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800">
                  Envoi en cours
                </p>
                <p className="text-xs text-gray-500">
                  Veuillez patienter pendant l'envoi de votre message
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-[#4ECDC4] bg-opacity-20 rounded-full scale-110 animate-pulse"></div>
                <div className="relative bg-gradient-to-tr from-[#4ECDC4] to-teal-400 p-3 rounded-full z-10">
                  <CheckCircle className="text-white h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800">
                  Message envoyé
                </p>
                <p className="text-xs text-gray-500">
                  Votre réponse a été envoyée avec succès
                </p>
              </div>
            </>
          )}
          <button
            className="ml-auto text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
            onClick={() => setShowToast(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Modal de limite de fichiers */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[10001] fade-in">
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl zoom-in border border-gray-100"
            style={{
              boxShadow:
                "0 20px 60px rgba(0, 0, 0, 0.1), 0 10px 25px rgba(0, 0, 0, 0.1)",
              background: "linear-gradient(to bottom, #ffffff, #f9fafb)",
            }}
          >
            {/* En-tête avec icône d'avertissement */}
            <div className="flex items-center mb-4 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                <AlertCircle size={22} className="text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 flex-1">
                Limite de fichiers atteinte
              </h3>
              <button
                onClick={() => setShowLimitModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 focus:outline-none"
                aria-label="Fermer"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            {/* Corps du message */}
            <div className="mb-6 py-2">
              <p className="text-gray-600 leading-relaxed">
                {limitModalMessage}
              </p>
            </div>

            {/* Pied avec bouton */}
            <div className="flex justify-end">
              <button
                className="px-5 py-2.5 bg-[#4ECDC4] text-white rounded-lg text-sm font-medium hover:bg-[#3dbeb6] transition-colors duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] focus:ring-opacity-50 transform hover:-translate-y-0.5"
                onClick={() => setShowLimitModal(false)}
              >
                Je comprends
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de prévisualisation d'image */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[10001] p-4 fade-in">
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
            {/* Barre d'outils supérieure */}
            <div className="absolute top-4 right-4 flex space-x-2 rotate-in">
              {isZoomed && (
                <button
                  onClick={() => setIsZoomed(false)}
                  className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                  title="Réinitialiser le zoom"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                title={isZoomed ? "Réduire" : "Agrandir"}
              >
                {isZoomed ? (
                  <MinusCircle size={20} />
                ) : (
                  <PlusCircle size={20} />
                )}
              </button>
              <button
                onClick={() => setPreviewImage(null)}
                className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                title="Fermer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Conteneur principal de l'image */}
            <div
              className={`bg-white rounded-lg p-3 shadow-xl overflow-hidden preview-shadow zoom-in ${isZoomed ? "max-h-none max-w-none" : "max-h-full max-w-full"
                }`}
            >
              <div className="relative">
                <img
                  src={previewImage}
                  alt="Prévisualisation"
                  className={`${isZoomed
                    ? "max-h-none max-w-none cursor-zoom-out transform scale-150 transition-transform duration-300"
                    : "max-h-[80vh] max-w-full object-contain cursor-zoom-in transition-transform duration-300"
                    }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />

                {/* Indicateur de zoom */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs">
                  {isZoomed ? "Cliquez pour réduire" : "Cliquez pour agrandir"}
                </div>
              </div>
            </div>

            {/* Flèches de navigation (visible uniquement s'il y a plusieurs images) */}
            {notificationAttachments.length > 1 && (
              <>
                {currentImageIndex > 0 && (
                  <button
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      const prevIndex = currentImageIndex - 1;
                      if (prevIndex >= 0) {
                        const prevAttachment =
                          notificationAttachments[prevIndex];
                        if (prevAttachment.file.type.startsWith("image/")) {
                          setPreviewImage(prevAttachment.preview);
                          setCurrentImageIndex(prevIndex);
                          setIsZoomed(false);
                        }
                      }
                    }}
                    title="Image précédente"
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}

                {currentImageIndex < notificationAttachments.length - 1 && (
                  <button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      const nextIndex = currentImageIndex + 1;
                      if (nextIndex < notificationAttachments.length) {
                        const nextAttachment =
                          notificationAttachments[nextIndex];
                        if (nextAttachment.file.type.startsWith("image/")) {
                          setPreviewImage(nextAttachment.preview);
                          setCurrentImageIndex(nextIndex);
                          setIsZoomed(false);
                        } else {
                          // Chercher la prochaine image
                          for (
                            let i = nextIndex;
                            i < notificationAttachments.length;
                            i++
                          ) {
                            if (
                              notificationAttachments[i].file.type.startsWith(
                                "image/"
                              )
                            ) {
                              setPreviewImage(
                                notificationAttachments[i].preview
                              );
                              setCurrentImageIndex(i);
                              setIsZoomed(false);
                              break;
                            }
                          }
                        }
                      }
                    }}
                    title="Image suivante"
                  >
                    <ChevronRight size={24} />
                  </button>
                )}

                {/* Indicateur de position */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
                  {currentImageIndex + 1} /{" "}
                  {
                    notificationAttachments.filter((a) =>
                      a.file.type.startsWith("image/")
                    ).length
                  }
                </div>
              </>
            )}

            {/* Overlay pour fermer en cliquant n'importe où (désactivé en mode zoom) */}
            {!isZoomed && (
              <div
                className="absolute inset-0 z-[-1]"
                onClick={() => setPreviewImage(null)}
              ></div>
            )}
          </div>
        </div>
      )}

      {/* Loader pour la déconnexion */}
      {(isLoading || isLogoutLoading) && <Loader context="logout" />}
    </>
  );
};

export default Navbar;
