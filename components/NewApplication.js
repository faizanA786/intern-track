import React, {useState} from "react";
import styles from './Form.module.css';
import Link from 'next/link';

export default function NewApplication() {
    async function handleSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const email = form.email.value;

        try {
            const response = await fetch("/api/application", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    title,
                    password
                })
            });
        
        }
        catch(error) {
            setMsg("Internal server error");
            console.error(error);
        }
    }

    return (
        <div className={styles.div}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h1 className={styles.h1}>New Application</h1>
                <input name="title" className={title ? styles.errorInput : styles.input} type="email" placeholder="Email" required/>
                <input name="password" className={confirmpassword ? styles.errorInput : styles.input} type="password"  placeholder="Password" required/>
                <button className={styles.button} type="submit">Login</button>
                <p className={styles.err}>{msg}</p>
                <p className={styles.p}>
                    Don't have an account?{" "}<Link className={styles.a} href="signup-page">Register here</Link>
                </p>
            </form>
        </div>
    );
}