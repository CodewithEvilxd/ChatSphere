import { selectedUserData, setUserData } from '@/store/slices/authSlice';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage } from '../ui/avatar';
import { getColor } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { CirclePower, EditIcon } from 'lucide-react';
import { setOnlineStatus } from '@/store/slices/usersSlice';

const ProfileInfo = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userData = useSelector(selectedUserData);

    const split = () => {
        const result = [];

        const first = userData?.firstName.split("").shift();
        const last = userData?.lastName.split("").shift();

        result.push(first);
        result.push(last);

        return result.join("");
    };

    const handleLogout = async () => {
        try {
            const res = await fetch(`${API_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
      
            if (res.ok) {
                dispatch(setOnlineStatus({}));
                dispatch(setUserData(undefined));
        
                navigate("/auth");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="absolute bottom-0 h-16 flex items-center justify-between px-4 w-full bg-[#2a2b33]">
            <div className="flex gap-3 items-center justify-center">
                <div className="w-10 h-10 rounded-full  relative">
                    <Avatar>
                        {userData.image ? (
                            <AvatarImage
                                src={userData.image}
                                alt="profile"
                                className={"object-cover w-full h-full rounded-full bg-black"}
                                loading="lazy"
                            />
                        ) : (
                            <div
                                className={`uppercase h-10 w-10  text-xs border flex-center rounded-full ${getColor(
                                userData.color
                                )}`}
                            >
                                {userData?.firstName && userData?.lastName
                                ? split()
                                : userData.email.split("").shift()}
                            </div>
                        )}
                    </Avatar>
                </div>
                <div>
                    {userData.firstName && userData.lastName ? (
                        <span className="text-sm lg:text-sm">{`${userData.firstName} ${userData.lastName}`}</span>
                    ) : (
                        ""
                    )}
                </div>
            </div>
            <div className="flex gap-1">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className='p-2'>
                            <EditIcon
                                className="text-purple-500 text-medium w-5 h-5"
                                onClick={() => navigate("/profile")}
                            />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] border-none p-2  text-white">
                            Edit Profile
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className='p-2'>
                        <CirclePower
                            className="text-red-500 text-medium w-5 h-5"
                            onClick={handleLogout}
                        />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] border-none p-2  text-white">
                            Logout
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
      );
}

export default ProfileInfo
