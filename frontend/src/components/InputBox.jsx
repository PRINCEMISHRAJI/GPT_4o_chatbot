import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const InputBox = ({ messages, setMessages, clearChat }) => {
    const [inputValue, setInputValue] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [options, setOptions] = useState([]);
    const [serviceType, setServiceType] = useState(null);
    const fileInputRef = useRef(null);

    const handleAttachment = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleSearch = async () => {
        if (inputValue.trim() !== '' || imageFile) {
            const formData = new FormData();
            formData.append('text', inputValue);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            try {
                const response = await fetch('/upload-image', {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();

                // Handle response for options
                if (data.options) {
                    setOptions(data.options);
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { sender: 'user', text: inputValue, image: imagePreview },
                        { sender: 'bot', text: data.message }
                    ]);
                } else {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { sender: 'user', text: inputValue, image: imagePreview },
                        { sender: 'bot', text: data.description }
                    ]);
                }
                setInputValue('');
                setImagePreview(null);
                setImageFile(null);
            } catch (error) {
                console.error('Error sending message:', error);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { sender: 'bot', text: 'Error processing your request.' }
                ]);
            }
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleFileChange = async (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            const file = files[0];
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setImageFile(file);
        }
    };

    const handleOptionClick = async (value) => {
        setServiceType(value);
        setOptions([]); // Clear options after selection
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'user', text: value }
        ]);

        try {
            const response = await fetch(`/service/option/${value}`, {
                method: 'POST'
            });
            const data = await response.json();
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'bot', text: data.message }
            ]);
        } catch (error) {
            console.error('Error selecting option:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'bot', text: 'Error handling your selection.' }
            ]);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const phone = form.phone.value;

        try {
            const response = await fetch('/lead/capture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    service_type: serviceType
                })
            });
            const data = await response.json();
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'bot', text: data.message }
            ]);
        } catch (error) {
            console.error('Error submitting form:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'bot', text: 'Error submitting your details.' }
            ]);
        }
    };

    return (
        <>
            <div className="input-container center">
                <div className='icon left-icon'>
                    <FontAwesomeIcon
                        icon={faPaperclip}
                        onClick={handleAttachment}
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                <div className="input-wrapper">
                    <input
                        type="text"
                        placeholder="Type a message here and hit Enter..."
                        className="search-input"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter')
                                handleSearch();
                        }}
                    />
                    {imagePreview && (
                        <div className="image-preview-container">
                            <img src={imagePreview} alt="Preview" className="image-preview" />
                        </div>
                    )}
                    <button
                        className='center right-icon'
                        onClick={handleSearch}
                    >
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            </div>

            {options.length > 0 && (
                <div className="options-container center">
                    {options.map((option, index) => (
                        <button key={index} onClick={() => handleOptionClick(option.value)}>
                            {option.text}
                        </button>
                    ))}
                </div>
            )}

            {serviceType && !options.length && (
                <form onSubmit={handleFormSubmit} className="form-container">
                    <h3>Provide your details for {serviceType}</h3>
                    <input type="text" name="name" placeholder="Name" required />
                    <input type="email" name="email" placeholder="Email" required />
                    <input type="tel" name="phone" placeholder="Phone" required />
                    <button type="submit">Submit</button>
                </form>
            )}

            <div className="center">
                <button className='btn' onClick={clearChat}>
                    Clear Chat
                </button>
            </div>
        </>
    );
};

export default InputBox;
