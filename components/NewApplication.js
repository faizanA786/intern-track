import React, {useState} from "react";
import styles from './Application.module.css';
import Link from 'next/link';
import { authenticate } from "../utils/auth";
import { useRouter } from 'next/router';

export default function NewApplication({ onClose, onSubmit }) {
    const router = useRouter();

    const[typeErr, setTypeErr] = useState(false)
    const[statusErr, setStatusErr] = useState(false)
    const[title, setTitleErr] = useState(false)
    const[company, setCompanyErr] = useState(false)
    const[date, setDateErr] = useState(false)
    const[link, setLinkErr] = useState(false)
    const[folder, setFolderErr] = useState(false)
    const[type, setType] = useState("")
    const[status, setStatus] = useState("")
    const[msg, setMsg] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        const form = event.target;

        const title = form.title.value;
        const company = form.company.value;
        const link = form.link.value;
        const appliedDate = form.appliedDate.value;
        const folder = form.folder.value;

        setTitleErr(false)
        setCompanyErr(false)
        setDateErr(false)
        setLinkErr(false)
        setFolderErr(false)
        setStatusErr(false)
        setTypeErr(false)

        try {
            const response = await fetch("/api/application", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({
                    title,
                    company,
                    type,
                    status,
                    link,
                    appliedDate,
                    folder
                })
            });

            if (response.status === 429) {
                setMsg("Too many requests, please wait");
                return;
            }
            if (response.status === 401) { // expired token
                router.push("/login-page");
            }

            if (!response.ok) {
                const data = await response.json();
                if (data.message === "title") {
                    setTitleErr(true);
                }
                if (data.message === "company") {
                    setCompanyErr(true);
                }
                if (data.message === "link") {
                    setLinkErr(true);
                }
                if (data.message === "date") {
                    setDateErr(true);
                }
                if (data.message === "folder") {
                    setFolderErr(true);
                }
                if (data.message === "status") {
                    setStatusErr(true);
                }
                if (data.message === "type") {
                    setTypeErr(true);
                }
                setMsg("Fields must not be left empty");
                return;
            }

            // setMsg("Application submitted successfully!");
            onSubmit()
            form.reset();
        } 
        catch (error) {
            setMsg("Internal server error");
            console.error(error);
        }
    }

    return (
        <div className={styles.div}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h1 className={styles.h1}>New Application</h1>
                <div className={styles.close}>
                    <img onClick={onClose} src="/images/close.svg" />
                </div>
                <div className={styles.block}>
                    <div className={typeErr ? styles.groupErr : styles.group}>
                        <div onClick={() => setType("Internship")} className={type === "Internship" ? styles["selected-box"]: styles.box}>
                            Internship
                        </div>
                        <div onClick={() => setType("Placement")} className={type === "Placement" ? styles["selected-box"]: styles.box}>
                            Placement
                        </div>
                    </div>


                    <div className={statusErr ? styles.groupErr : styles.group}>
                        <div onClick={() => setStatus("Applied")} className={status === "Applied" ? styles["selected-box"]: styles.box}>
                            Applied
                        </div>
                        <div onClick={() => setStatus("Interview")} className={status === "Interview" ? styles["selected-box"]: styles.box}>
                            Interview
                        </div>
                        <div onClick={() => setStatus("Offer")} className={status === "Offer" ? styles["selected-box"]: styles.box}>
                            Offer
                        </div>
                        <div onClick={() => setStatus("Rejected")} className={status === "Rejected" ? styles["selected-box"]: styles.box}>
                            Rejected
                        </div>
                    </div>
                </div>

                <div className={styles.grid}>
                    <input name="title" className={title ? styles.errorInput : styles.input} type="text" placeholder="Job Title" required />
                    <input name="company" className={company ? styles.errorInput : styles.input} type="text" placeholder="Company Name" required />

                    <input name="link" className={link ? styles.errorInput : styles.input} type="url" placeholder="Application Link (optional)" />
                    <input name="appliedDate" className={date ? styles.errorInput : styles.input} type="date" placeholder="Applied Date" />
                    <input name="folder" className={folder ? styles.errorInput : styles.input} type="text" placeholder="Folder Name" defaultValue="default" />

                    <div className={styles.centre}>
                        <button className={styles.button} type="submit">Create</button>
                    </div>
                </div>
                <p className={styles.err}>{msg}</p>
            </form>
        </div>
    );
}