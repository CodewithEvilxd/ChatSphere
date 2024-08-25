import { useEffect, useState } from 'react'
import { 
    TooltipProvider,
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '../ui/tooltip'
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalDescription,
    ResponsiveModalHeader,
    ResponsiveModalTitle,
} from "../ui/responsive-modal";
import { Plus } from 'lucide-react'
import { Button } from '../ui/button';
import { useDispatch } from 'react-redux';
import { useSocket } from '@/contexts/SocketContext';
import { toast } from 'sonner';
import MultipleSelector from '../ui/multipleselect';
import { Input } from '../ui/input';
import { addChannel, setTrigger } from '@/store/slices/chatSlice';

export const splitName = (firstName, lastName) => {
    const result = [];
  
    const first = firstName.split("").shift();
    const last = lastName.split("").shift();
  
    result.push(first);
    result.push(last);
  
    return result.join("");
};

const Channel = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const dispatch = useDispatch();
    const socket = useSocket();
    const [newChannelModal, setNewChannelModal] = useState(false);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [allContact, setAllContact] = useState([]);
    const [channelName, setChannelName] = useState("");
    
    console.log();
    


    useEffect(() => {
        dispatch(setTrigger(true));
        const getData = async () => {
            try {
                const res = await fetch(`${API_URL}/api/contacts/get-all-contacts`, {
                method: "GET",
                credentials: "include",
                });
        
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.erorrs);
                }
        
                if (res.ok) {
                    setAllContact(data.contacts);
                }
            } catch (error) {
                toast.error(error.message);
            }
        };
    
        getData();
    }, []);

    const handleCreateChannel = async () => {
        console.log("Selected Contacts:", selectedContacts); // Should show { label: 'user patil', value: 'userId' }
        const members = selectedContacts.map(contact => contact.value);
        // Ensure members contains valid IDs
        if (members.includes(null) || members.includes(undefined)) {
            toast.error("Invalid members selected.");
            return;
        }
        try {
        if (channelName.length > 0 && selectedContacts.length > 0) {
            // Ensure no null values in selectedContacts
            const validSelectedContacts = selectedContacts.filter(contact => contact !== null);

            if (validSelectedContacts.length === 0) {
                toast.error("Please select valid contacts.");
                return;
            }

            const res = await fetch("/api/channel/create-channel", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: channelName,
                    members: validSelectedContacts.map(contact => contact.value),
                }),
                credentials: "include",
            });

            const data = await res.json();
            console.log(data);

            if (!res.ok) {
                toast.error(data.message);
                throw new Error(data.errors);
            } else {
                socket.emit("channelCreated", data.channel);
                dispatch(addChannel(data.channel));
                setChannelName("");
                setSelectedContacts([]);
                setNewChannelModal(false);
            }
        }
        } catch (error) {
            toast.error(error.message);
        }
    }


    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Plus
                            onClick={() => {setNewChannelModal(true);   }}
                            className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none mt-2 p-3 text-white">
                        Select New Contact
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <ResponsiveModal open={newChannelModal} onOpenChange={setNewChannelModal}>
                <ResponsiveModalContent className="bg-[#181920] border-none  text-white w-full md:max-w-[500px] min-h-[400px] flex flex-col">
                    <ResponsiveModalHeader>
                        <ResponsiveModalTitle
                            className={"text-center mb-1 space-y-1 text-white"}
                        >
                            Please fill up the details for new channel.
                        </ResponsiveModalTitle>
                        <ResponsiveModalDescription></ResponsiveModalDescription>
                    </ResponsiveModalHeader>
                    <div className="">
                        <Input
                            placeholder="Channel Name..."
                            className="rounded-lg p-4 text-xs bg-[#2c2e3b] border-none "
                            onChange={(e) => setChannelName(e.target.value)}
                            value={channelName}
                        />
                    </div>
                    <div>
                        <MultipleSelector
                            className="rounded-lg bg-[#2c2e3b]  border-none py-3 text-xs text-white"
                            defaultOptions={allContact}
                            placeholder="Search Contacts..."
                            value={selectedContacts}
                            // onChange={(selected) => {
                            //     const formattedContacts = selected.map(contact => ({
                            //         label: contact.label, // User-friendly name
                            //         value: contact.value, // User ID
                            //     }));
                            //     setSelectedContacts(formattedContacts);
                            // }}
                            onChange={setSelectedContacts  }
                            emptyIndicator={
                                <p className="text-center text-lg leading-6 text-gray-600">
                                No result found.
                                </p>
                            }
                        />
                    </div>
                    <div>
                        <Button
                            className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                            onClick={handleCreateChannel}
                        >
                        Create Channel
                        </Button>
                    </div>
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    )
}

export default Channel
