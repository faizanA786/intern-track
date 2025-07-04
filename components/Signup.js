import React, {useState} from "react";
import styles from './Form.module.css';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Signup() {
    const router = useRouter();

    const [forename, setForename] = useState(false);
    const [email, setEmail] = useState(false);
    const [confirmpassword, setConfirmPassword] = useState(false);
    const [msg, setMsg] = useState('');  
    
    async function handleSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const forename = form.forename.value;
        const email = form.email.value;
        const password = form.password.value;
        const confirmPassword = form.confirmpassword.value;
        const agreed = form.terms?.checked;
        
        setConfirmPassword(false);
        setEmail(false);

        if (!agreed) {
            setMsg("You must agree to the Terms & Services");
            return;
        }
        if (password.length < 6) {
            setMsg("Password is too short");
            setConfirmPassword(true);
            return;
        }
        if (password !== confirmPassword) {
            setMsg("Passwords do not match");
            setConfirmPassword(true);
            return;
        }

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({forename, email, password})
            });

            if (response.status === 409) {
                setMsg("This email is already registered");
                setEmail(true);
                return;
            }
            if (!response.ok) {
                throw new Error("Signup failed!");
            }
            const data = await response.json();
            localStorage.setItem("token", data.token); 
            router.push('/dashboard'); 

        }
        catch(error) {
            setMsg("Internal server error");
        }
    }

    return (
        <div className={styles.div}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h1 className={styles.h1}>Sign Up</h1>
                <input name="forename" className={styles.input} type="text" placeholder="Forename" required/>
                <input name="email" className={email ? styles.errorInput : styles.input} type="email" placeholder="Email" required/>
                <input name="password" className={confirmpassword ? styles.errorInput : styles.input} type="password"  placeholder="Password" required/>
                <input name="confirmpassword" className={confirmpassword ? styles.errorInput : styles.input} type="password"  placeholder="Confirm Password" required/>
                <label className={styles.label}>
                    <input name="terms" type="checkbox"/><p className={styles.p}>I agree to the <a className={styles.a} href="">Terms & Services</a></p>
                </label>
                <button className={styles.button} type="submit">Register</button>
                <p className={styles.err}>{msg}</p>
                <p className={styles.p}>
                    Have an account?{" "}<Link className={styles.a} href="/login-page">Login here</Link>
                </p>
            </form>
        </div>
    );
}