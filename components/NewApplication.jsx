import React, {useState} from "react";
import styles from './Application.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function NewApplication({ onClose, onSubmit }) {
    const router = useRouter();

    const[typeErr, setTypeErr] = useState(false) //intern/placement
    const[statusErr, setStatusErr] = useState(false)
    const[titleErr, setTitleErr] = useState(false)
    const[companyErr, setCompanyErr] = useState(false)
    const[dateErr, setDateErr] = useState(false)
    const[linkErr, setLinkErr] = useState(false)
    const[folderErr, setFolderErr] = useState(false)
    const[type, setType] = useState("")
    const[status, setStatus] = useState("")
    const[msg, setMsg] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setMsg("Loading...")
        setTitleErr(false)
        setCompanyErr(false)
        setDateErr(false)
        setLinkErr(false)
        setFolderErr(false)
        setStatusErr(false)
        setTypeErr(false)

        const form = event.target;
        const title = form.title.value;
        const company = form.company.value;
        const link = form.link.value;
        const appliedDate = form.appliedDate.value;
        const folder = form.folder.value;

        function validateFields(data) {
            if (data.error === "title") {
                setTitleErr(true);
            }
            if (data.error === "company") {
                setCompanyErr(true);
            }
            if (data.error === "link") {
                setLinkErr(true);
            }
            if (data.error === "date") {
                setDateErr(true);
            }
            if (data.error === "folder") {
                setFolderErr(true);
            }
            if (data.error === "status") {
                setStatusErr(true);
            }
            if (data.error === "type") {
                setTypeErr(true);
            }
            setMsg("Fields must not be left empty");

            if (data.error === "timeout") {
                setMsg("Too many request, slow down.")
            }
            if (data.error === "limit") {
                setMsg("Application limit reached")
            }
        }

        try {
            const response = await fetch("/api/application/newApplication", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
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

            if (!response.ok) {
                const data = await response.json();
                if (data.error == "timeout") {
                    setMsg("Too many requests, slow down")
                    return
                }
                else if (data.error === "invalid/expired token") {
                    router.push("/Login-Page")
                }
                validateFields(data);
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
                    <input name="title" className={titleErr ? styles.errorInput : styles.input} type="text" placeholder="Job Title" required />
                    <input name="company" className={companyErr ? styles.errorInput : styles.input} type="text" placeholder="Company Name" required />

                    <input name="link" className={linkErr ? styles.errorInput : styles.input} type="url" placeholder="Application Link (optional)" />
                    <input name="appliedDate" className={dateErr ? styles.errorInput : styles.input} type="date" placeholder="Applied Date" />
                    <input name="folder" className={folderErr ? styles.errorInput : styles.input} type="text" placeholder="Folder Name" defaultValue="default" />

                    <div className={styles.centre}>
                        <button className={styles.button} type="submit">Create</button>
                    </div>
                </div>
                <p className={styles.err}>{msg}</p>
            </form>
        </div>
    );
}