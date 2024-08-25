import React, { useState } from 'react'
import Background from "../assets/login1.png";
import { Tabs, TabsList,TabsContent,TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setUserData } from '@/store/slices/authSlice';


const Auth = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPasswod] = useState("");
    const [activeTab, setActiveTab] = useState("Login");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });
    
            const data = await res.json();
    
            if (!res.ok) {
                // Display the actual error message
                toast.error(data.message || "Login failed");
            }
    
            if (data.user && data.user._id) {
                dispatch(setUserData(data.user));
                data.user.profileSetup ? navigate("/chat") : navigate("/profile");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };
    
    const handleSignUp = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email, password, confirmPassword }),
            });
    
            const data = await res.json();
    
            if (!res.ok) {
                // Display the actual error message
                toast.error(data.message || "Signup failed");
            } else {
                dispatch(setUserData(data.user));
                navigate("/profile");
                // window.location.reload();
            }
        } catch (error) {
            toast.error(error.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className='h-[100vh] w-[100vw]  flex items-center justify-center'>
            <div className="min-h-[65vh] md:min-h-[70vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-xl sm:rounded-2xl lg:rounded-3xl grid md:grid-cols-2">
                
                <div className="flex flex-col gap-10 items-center justify-center w-full">

                    <div className="flex items-center justify-center flex-col">
                        <div className="flex items-center justify-center">
                            <div className="text-2xl sm:text-3xl font-semibold text-purple-700 md:text-4xl">
                                ChatSphere.
                            </div>
                        </div>
                        <p className="font-medium text-xs md:text-base text-center mt-2 max-w-[220px] sm:max-w-[300px]  ">
                        Fill in details to get started with the best chat app!
                        </p>
                    </div>

                    <div className="flex items-center justify-center w-full">
                        <Tabs className='w-3/4' defaultValue='Login' onValueChange={setActiveTab}>
                            <TabsList className="grid grid-cols-2 text-md bg-transparent rounded-none ">
                                <TabsTrigger
                                    value="Login"
                                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none  data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 w-full"
                                    disabled = {loading}
                                >
                                    Login
                                </TabsTrigger>
                                <TabsTrigger
                                    value="SignUp"
                                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none  data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 w-full"
                                    disabled = {loading}
                                >
                                    Signup
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent className="mt-4 select-none" value="Login">
                                <div className="flex flex-col gap-5 ">
                                    <Input
                                        type="email"
                                        placeholder={"Email"}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="rounded-full p-4 text-sm"
                                    />
                                    <Input
                                        type="password"
                                        placeholder={"Password"}
                                        className="rounded-full p-4 text-sm"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <Button
                                        type={"submit"}
                                        className={
                                        "rounded-full p-4 text-sm disabled:bg-primary/100"
                                        }
                                        onClick={handleLogin}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Please wait
                                            </>
                                            ) : (
                                            "Login"
                                            )}
                                    </Button>
                                </div>
                            </TabsContent>
                            <TabsContent className="mt-4 " value="SignUp">
                                <div className="flex flex-col gap-5">
                                    <Input
                                        type="email"
                                        placeholder={"Email"}
                                        className="rounded-full p-4 text-xs"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <Input
                                        type="password"
                                        placeholder={"Password"}
                                        className="rounded-full p-4 text-xs"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <Input
                                        type="password"
                                        placeholder={"Confirm password"}
                                        className="rounded-full p-4 text-xs"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPasswod(e.target.value)}
                                    />
                                    <Button
                                        type={"submit"}
                                        className={
                                        "rounded-full p-4 text-xs disabled:bg-primary/90"
                                        }
                                        onClick={handleSignUp}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Please wait
                                            </>
                                            ) : (
                                            "Sign Up"
                                        )}
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>


                {/* side image */}
                <div className="hidden md:flex justify-center items-center">
                    <img src={Background} alt="background login" loading="lazy" />
                </div>

            </div>
        </div>
    )
}

export default Auth
