import React, {useState} from "react";
import styles from './Form.module.css';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
    const router = useRouter();

    const [usernameErr, setUsernameErr] = useState(false);
    const [confirmPasswordErr, setConfirmPasswordErr] = useState(false);
    const [msg, setMsg] = useState("");  

    function handleStates(data) {
        if (data.error === "username empty") {
            setUsernameErr(true);
            setMsg("Username must not be left empty");
        }
        else if (data.error === "password empty") {
            setConfirmPasswordErr(true);
            setMsg("Password must not be left empty");
        }
        else if (data.error === "user not found") {
            setUsernameErr(true);
            setMsg("This user was not found");
        }
        else if (data.error === "incorrect password") {
            setConfirmPasswordErr(true);
            setMsg("Incorrect password");
        }
        else if (data.error === "timeout") {
            setMsg("Too many request, slow down.")
        }
    }
    
    async function handleSubmit(event) {
        event.preventDefault();
        setMsg("Loading...")
        setConfirmPasswordErr(false);
        setUsernameErr(false);
        
        const form = event.target;
        const username = form.username.value;
        const password = form.password.value;
        
        try {
            const response = await fetch("/api/account/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, password})
            });

            if (!response.ok) {
                const data = await response.json();
                handleStates(data)
                return;
            }

            // const data = await response.json();
            // localStorage.setItem("token", data.token); 
            router.push("/Dashboard-Page"); 

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
                <input name="username" className={usernameErr ? styles.errorInput : styles.input} placeholder="Username" required/>
                <input name="password" className={confirmPasswordErr ? styles.errorInput : styles.input} type="password"  placeholder="Password" required/>
                <button className={styles.button} type="submit">Login</button>
                <p className={styles.err}>{msg}</p>
                <p className={styles.p}>
                    Don't have an account?{" "}<Link className={styles.a} href="Signup-Page">Register here</Link>
                </p>
            </form>
        </div>
    );
}