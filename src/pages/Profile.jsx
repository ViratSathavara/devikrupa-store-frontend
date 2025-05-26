import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

const Profile = () => {
    const [user, setUser] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        image: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [password, setPassword] = useState('');
    const fileInputRef = useRef(null);

    const userId = JSON.parse(localStorage.getItem('user'));
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/auth/${userId.userId}`);
                if (response.status === 200) {
                    setUser(response?.data?.data?.user);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (userId?.userId) {  // Add optional chaining
            fetchUserData();
        }
    }, [userId?.userId]);  // Only depend on the specific property

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('firstname', user.firstname);
        formData.append('lastname', user.lastname);
        formData.append('email', user.email);
        formData.append('phone', user.phone);

        // Only append password if it's being changed
        if (password) {
            formData.append('password', password);
        }

        if (fileInputRef.current?.files[0]) {
            formData.append('image', fileInputRef.current.files[0]);
        }

        try {
            const response = await axios.put(
                `http://localhost:5000/auth/${userId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.status === 200) {
                setUser(response.data.user);
                setPassword('');
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <div className="max-w-3xl mt-10 max-h-auto h-[70%] p-6 bg-white rounded-lg shadow-md">
            <div className='flex w-full justify-between'>
                <h2 className="text-20 font-bold mb-6">Profile</h2>
                {!isEditing ? (
                    <Button
                        onClick={handleEditToggle}
                        variant='contained'
                        className='!p-2 h-32 !capitalize !text-white !bg-green-700'
                    >
                        Edit Profile
                    </Button>)
                    : (
                        <div className="flex gap-6">
                            <Button
                                variant='contained'
                                className='!p-2 !capitalize h-32 !text-white !bg-green-700'
                            >
                                Save Changes
                            </Button>
                            <Button
                                onClick={handleEditToggle}
                                // disabled={}
                                variant='contained'
                                className='!p-2 h-32 !capitalize !text-black !bg-gray-300'
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
            </div>
            {!isEditing ? (

                <div className="space-y-14">
                    <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-gray-700 font-medium">Image:</label>
                        <img
                            src={user?.image
                                ? `http://localhost:5000${user?.image}`
                                : "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                            }
                            alt="Profile"
                            className="w-80 h-80 rounded-full object-cover border-2 border-black shadow-md"
                            onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4 items-center">
                        <label className="text-gray-700 font-medium">First Name:</label>
                        <p className="col-span-2 p-2 bg-gray-50 rounded border border-gray-200">
                            {user?.firstname || 'Not provided'}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center">
                        <label className="text-gray-700 font-medium">Last Name:</label>
                        <p className="col-span-2 p-2 bg-gray-50 rounded border border-gray-200">
                            {user?.lastname || 'Not provided'}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center">
                        <label className="text-gray-700 font-medium">Email:</label>
                        <p className="col-span-2 p-2 bg-gray-50 rounded border border-gray-200">
                            {user?.email || 'Not provided'}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center">
                        <label className="text-gray-700 font-medium">Phone:</label>
                        <p className="col-span-2 p-2 bg-gray-50 rounded border border-gray-200">
                            {user?.phone || 'Not provided'}
                        </p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-center mb-4">
                        <label className="cursor-pointer">
                            <img
                                src={fileInputRef.current?.files[0]
                                    ? URL.createObjectURL(fileInputRef.current.files[0])
                                    : user.image
                                        ? `http://localhost:5000${user.image}`
                                        : "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                                }
                                alt="Profile"
                                className="w-80 h-80 rounded-full object-cover border-2 border-gray-300"
                            />
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={() => { }} // Force re-render when file changes
                                className="hidden"
                                accept="image/*"
                            />
                        </label>
                    </div>

                    <div>
                        <label className="block text-gray-700">First Name</label>
                        <input
                            type="text"
                            name="firstname"
                            value={user.firstname}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Last Name</label>
                        <input
                            type="text"
                            name="lastname"
                            value={user.lastname}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={user.phone}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">New Password (leave blank to keep current)</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 p-2 w-full border rounded"
                        />
                    </div>


                </form>
            )}
        </div>
    );
};

export default Profile;