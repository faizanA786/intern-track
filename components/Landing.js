import React, {useEffect, useState} from "react";
import { useRouter } from 'next/router';
import styles from './Landing.module.css';
import Link from "next/link";

export default function Landing() {
    const router = useRouter();

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.h1}>Intern-Track</h1>
            <h2 className={styles.h2}>Track and organise your internship/placement applications, all in one place.</h2>
            <div className={styles.container}>
                <button type="submit" onClick={() => {router.push("/signup-page")}} className={styles.register}>Register</button>
                <button type="submit" onClick={() => {router.push("/login-page")}} className={styles.signIn}>Sign In</button>
            </div>
            <footer className={styles.footer}>
            <a href="https://github.com/faizanA786/intern-track/tree/master" target="_blank">Source Code</a>
        </footer>
        </div>

    );
}