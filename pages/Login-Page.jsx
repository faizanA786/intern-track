import React, {useState} from "react";
import styles from './Form.module.css';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
    const router = useRouter();

    const [username, setusername] = useState(false);
    const [confirmpassword, setConfirmPassword] = useState(false);
    const [msg, setMsg] = useState('');  
    
    async function handleSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const username = form.username.value;
        const password = form.password.value;
        
        setConfirmPassword(false);
        setusername(false);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, password})
            });

            if (response.status === 429) {
                setMsg("Too many requests, please wait");
                return;
            }
            
            if (response.status === 404) {
                setMsg("User not found");
                setusername(true);
                return;
            }
            if (response.status === 401) {
                setMsg("Incorrect password");
                setConfirmPassword(true);
                return;
            }
            if (!response.ok) {
                const data = await response.json();
                if (data.message === "username") {
                    setusername(true);
                }
                if (data.message === "password") {
                    setConfirmPassword(true);
                }
                setMsg("Fields must not be left empty");
                return;
            }

            const data = await response.json();
            localStorage.setItem("token", data.token); 
            router.push("/dashboard-page"); 

        }
        catch(error) {
            setMsg("Internal server error");
            console.error(error);
        }
    }

    return (
        <div className={styles.div}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h1 className={styles.h1}>Sign In</h1>
                <input name="username" className={username ? styles.errorInput : styles.input} placeholder="Username" required/>
                <input name="password" className={confirmpassword ? styles.errorInput : styles.input} type="password"  placeholder="Password" required/>
                <button className={styles.button} type="submit">Login</button>
                <p className={styles.err}>{msg}</p>
                <p className={styles.p}>
                    Don't have an account?{" "}<Link className={styles.a} href="Signup-Page">Register here</Link>
                </p>
            </form>
        </div>
    );
}