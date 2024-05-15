import React, { useState, useEffect } from 'react';
import './RegistrationForm.css'; // Import the CSS file for styling


const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        code: ''
    });

    const [errors, setErrors] = useState({});
    const [verificationCodes, setVerificationCodes] = useState({});
    const [showRegistrationFields, setShowRegistrationFields] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [userName, setUserName] = useState('');
    const [bonvoyNumber, setBonvoyNumber] = useState('');

    useEffect(() => {
        console.log(verificationCodes);
    }, [verificationCodes]); // Log verificationCodes whenever it changes

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const sendVerificationEmail = async (email, code) => {
        try {
            const response = await fetch('http://localhost:3100/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: email,
                    subject: 'Verification Code',
                    text: `Your verification code is: ${code}`
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send verification email');
            }

            console.log('Verification email sent successfully.');
        } catch (error) {
            console.error('Error sending verification email:', error);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const sendCode = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await fetch('http://localhost:8080/validate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: formData.email })
                });

                if (!response.ok) {
                    throw new Error('Failed to get verification code');
                }

                const data = await response.json();
                const code = Number(data.validation_code);
                const email = formData.email;
                setVerificationCodes({
                    ...verificationCodes,
                    [email]: code
                });
                sendVerificationEmail(email, code);
                setShowRegistrationFields(true);
                console.log('Verification code sent successfully.');
            } catch (error) {
                console.error('Error getting verification code:', error);
                setErrors(prevErrors => ({ ...prevErrors, email: 'Failed to get verification code' }));
            }
        } else {
            console.log('Form is invalid, cannot send verification email.');
        }
    };

    const fetchBonvoyNumber = async () => {
        try {
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get Bonvoy number');
            }

            const data = await response.json();
            return data.member_number;
        } catch (error) {
            console.error('Error getting Bonvoy number:', error);
            return null;
        }
    };

    const registerUser = async (e) => {
        e.preventDefault();
        const { email, firstName, lastName, phoneNumber, code } = formData;
        const storedCode = verificationCodes[email];
        if (Number(code) === storedCode) {
            const bonvoyNumber = await fetchBonvoyNumber();
            if (bonvoyNumber) {
                setBonvoyNumber(bonvoyNumber);
                setRegistrationSuccess(true);
                setUserName(`${firstName} ${lastName}`);
                console.log('User registered successfully.');
            } else {
                setErrors({ general: 'Failed to register user. Please try again later.' });
            }
        } else {
            setErrors({ code: 'Verification code is incorrect' });
        }
    };

    return (
        <div>
            {!registrationSuccess ? (
                <form className="RegistrationForm" onSubmit={showRegistrationFields ? registerUser : sendCode}>
                    <input
                        type="email"
                        placeholder="Enter college email to validate"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                    {!showRegistrationFields && <button type="submit">Send Code</button>}
                    {showRegistrationFields && (
                        <div>
                            <input
                                type="text"
                                placeholder="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Verification Code"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                            />
                            {errors.code && <p className="error">{errors.code}</p>}
                            <button type="submit">Register</button>
                        </div>
                    )}
                </form>
            ) : (
                <div className="register">
                    <br/><br/><br/><br/><br/>
                    {userName}! Welcome to Marriott Bonvoy.<br/><br/>
                    Your member number is: <strong>{bonvoyNumber}</strong><br/><br/>
                    Create your profile using this <a href="https://www.marriott.com">link</a>.
                    <br/><br/>
                    As a welcome gift, you will receive a one-time coupon of $25 for Uber Eats.<br/><br/>
                    Use the discount code MMC to get 5% discount in all your hotel bookings through Marriott.com
                </div>
            )}
        </div>
    );
};

export default RegistrationForm;
