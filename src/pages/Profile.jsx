import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import { LoginContext } from '../contexts/LoginContext';

const Profile = () => {
    const { user: contextUser, setUser: setContextUser, handleNewUserDataAuthSuccess } = useContext(LoginContext);
    const [isEditing, setIsEditing] = useState(false);
    const [password, setPassword] = useState('');
    const [formData, setFormData] = useState({});
    const [hasChanges, setHasChanges] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    // Initialize form data when user changes or component mounts
    useEffect(() => {
        if (contextUser) {
            setFormData({
                firstname: contextUser.firstname || '',
                lastname: contextUser.lastname || '',
                email: contextUser.email || '',
                phone: contextUser.phone || ''
            });
        }
    }, [contextUser]);

    // Check for changes whenever form data, password, or file changes
    useEffect(() => {
        if (!contextUser) return;

        const initialValues = {
            firstname: contextUser.firstname || '',
            lastname: contextUser.lastname || '',
            email: contextUser.email || '',
            phone: contextUser.phone || ''
        };

        const formChanged = Object.keys(initialValues).some(
            key => formData[key] !== initialValues[key]
        );

        const fileChanged = selectedFile !== null;
        const passwordChanged = password !== '';

        setHasChanges(formChanged || fileChanged || passwordChanged);
    }, [formData, password, selectedFile, contextUser]);

    const userId = JSON.parse(localStorage.getItem('user'));

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        // Reset form data when canceling edit
        if (isEditing) {
            setFormData({
                firstname: contextUser.firstname || '',
                lastname: contextUser.lastname || '',
                email: contextUser.email || '',
                phone: contextUser.phone || ''
            });
            setPassword('');
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('firstname', formData.firstname);
        data.append('lastname', formData.lastname);
        data.append('email', formData.email);
        data.append('phone', formData.phone);

        if (password) {
            data.append('password', password);
        }

        if (selectedFile) {
            data.append('image', selectedFile);
        }

        console.log(userId?.userId)
        
        try {
            const response = await axios.put(
                `http://localhost:5000/auth/${userId?.userId}`,
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.status === 200) {
                toast.success('Profile updated successfully');
                setContextUser(response.data.user);
                handleNewUserDataAuthSuccess(response.data.user);
                setPassword('');
                setSelectedFile(null);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <div className="max-w-3xl mt-10 max-h-auto h-[70%] p-6 mx-6 bg-white rounded-lg shadow-md">
            <div className='flex w-full justify-between'>
                <h2 className="text-20 font-bold mb-6">Profile</h2>
                {!isEditing && (
                    <Button
                        onClick={handleEditToggle}
                        variant='contained'
                        className='!p-2 h-32 !capitalize !text-white !bg-green-700'
                    >
                        Edit Profile
                    </Button>
                )}
            </div>
            
            {!isEditing ? (
                <div className="space-y-14">
                    <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-gray-700 font-medium">Image:</label>
                        <img
                            src={contextUser?.image
                                ? `http://localhost:5000${contextUser?.image}`
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
                            {contextUser?.firstname || 'Not provided'}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center">
                        <label className="text-gray-700 font-medium">Last Name:</label>
                        <p className="col-span-2 p-2 bg-gray-50 rounded border border-gray-200">
                            {contextUser?.lastname || 'Not provided'}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center">
                        <label className="text-gray-700 font-medium">Email:</label>
                        <p className="col-span-2 p-2 bg-gray-50 rounded border border-gray-200">
                            {contextUser?.email || 'Not provided'}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center">
                        <label className="text-gray-700 font-medium">Phone:</label>
                        <p className="col-span-2 p-2 bg-gray-50 rounded border border-gray-200">
                            {contextUser?.phone || 'Not provided'}
                        </p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-6">
                        <Button
                            variant='contained'
                            type='submit'
                            className='!p-2 !capitalize h-32 disabled:!bg-gray-300 disabled:!text-black !text-white !bg-green-700'
                            disabled={!hasChanges}
                        >
                            Save Changes
                        </Button>
                        <Button
                            onClick={handleEditToggle}
                            variant='contained'
                            className='!p-2 h-32 !capitalize !text-black !bg-gray-300'
                        >
                            Cancel
                        </Button>
                    </div>
                    <div className="flex justify-center mb-4">
                        <label className="cursor-pointer">
                            <img
                                src={selectedFile
                                    ? URL.createObjectURL(selectedFile)
                                    : contextUser?.image
                                        ? `http://localhost:5000${contextUser.image}`
                                        : "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                                }
                                alt="Profile"
                                className="w-80 h-80 rounded-full object-cover border-2 border-gray-300"
                            />
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
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
                            value={formData.firstname || ''}
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
                            value={formData.lastname || ''}
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
                            value={formData.email || ''}
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
                            value={formData.phone || ''}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border rounded"
                        />
                    </div>

                    {/* <div>
                        <label className="block text-gray-700">New Password (leave blank to keep current)</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 p-2 w-full border rounded"
                        />
                    </div> */}
                </form>
            )}
        </div>
    );
};

export default Profile;