import React, {useState} from "react";
import styles from './Form.module.css';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Signup() {
    const router = useRouter();

    const [usernameErr, setUsernameErr] = useState(false);
    const [passwordErr, setPasswordErr] = useState(false);
    const [confirmPasswordErr, setConfirmPasswordErr] = useState(false);
    const [msg, setMsg] = useState("");  
    
    function handleStates(data) {
      if (data.error === "terms") {
          setMsg("Terms must be accepted");
      }
      else if (data.error === "empty password") {
          setPasswordErr(true);
          setMsg("Fields must not be left empty");
      }
      else if (data.error === "empty confirm password") {
          setConfirmPasswordErr(true);
          setMsg("Fields must not be left empty");
      }
      else if (data.error === "passwords dont match") {
          setPasswordErr(true);
          setConfirmPasswordErr(true);
          setMsg("Passwords do not match");
      }
      else if (data.error === "password length") {
          setPasswordErr(true)
          setMsg("Password must be atleast 6 characters");
      }
      else if (data.error === "username length") {
          setUsernameErr(true)
          setMsg("Username must be atleast 6 characters");
      }
      else if (data.error === "user already exists") {
          setMsg("User already exists.");
      }
    }

    async function handleSubmit(event) {
        //RESET DISPLAY ERRORS
        setMsg("Loading...")
        setPasswordErr(false);
        setConfirmPasswordErr(false);
        setUsernameErr(false);

        event.preventDefault();
        
        const form = event.target;
        const username = form.username.value;
        const password = form.password.value;
        const confirmPassword = form.confirmpassword.value;
        const termsAgreed = form.terms.checked;

        try {
            const response = await fetch("/api/account/signup", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, password, confirmPassword, termsAgreed})
            });

            if (!response.ok) {
                const data = await response.json();
                handleStates(data)
                return;
            }

            const data = await response.json();
            localStorage.setItem("token", data.token); 
            router.push('/Dashboard-Page'); 

        }
        catch(error) {
            console.log(error)
            setMsg("backend error");
        }
    }

    return (
        <div className={styles.div}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h1 className={styles.h1}>Sign Up</h1>
                <input name="username" className={usernameErr ? styles.errorInput : styles.input} placeholder="Username" required/>
                <input name="password" className={passwordErr ? styles.errorInput : styles.input} type="password"  placeholder="Password" required/>
                <input name="confirmpassword" className={confirmPasswordErr ? styles.errorInput : styles.input} type="password"  placeholder="Confirm Password" required/>
                <label className={styles.label}>
                    <input name="terms" type="checkbox"/><p className={styles.p}>I agree to the <a className={styles.a} href="https://github.com/faizanA786/intern-track/blob/master/TERMS.md" target="_blank">Terms & Services</a></p>
                </label>
                <button className={styles.button} type="submit">Register</button>
                <p className={styles.err}>{msg}</p>
                <p className={styles.p}>
                    Have an account?{" "}<Link className={styles.a} href="/Login-Page">Login here</Link>
                </p>
            </form>
        </div>
    );
}