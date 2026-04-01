import React, {useState} from "react";
import styles from './Application.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from "react";

export default function EditApplication({id, onSubmit, onClose}) {
    const[preTitle, setPreTitle] = useState("")
    const[preCompany, setPreCompany] = useState("")
    const[preLink, setPreLink] = useState("")
    const[preDate, setPreDate] = useState("")
    const[preFolder, setPreFolder] = useState("")

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

    const router = useRouter();

    useEffect(() => {
        (async () => {
            setMsg("Loading...")
            try {
                const response = await fetch("/api/application/getApplication", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id
                    })
                });
                if (!response.ok) { 
                    const data = await response.json()
                    console.log("parsing")
                    if (data.error === "timeout") {
                        setMsg("Too many requests, slow down")
                        return
                    }
                    // router.push("/Login-Page");
                }

                const data = await response.json();

                setType(data.type);
                setStatus(data.status);
                setPreTitle(data.title);
                setPreCompany(data.company);
                setPreLink(data.link);
                setPreDate(data.appliedDate.slice(0, 10));
                setPreFolder(data.folder);
                setMsg("")

            } catch (error) {
                console.log(error);
            }
        })();
    }, []); // run once when component mounts

    async function handleDelete() {
        setMsg("Loading...")
        try {
            const response = await fetch("/api/application/deleteApplication", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id
                })
            });

            // const data = await response.json();
            if (!response.ok) {
                router.push("/Login-Page");
            }
            else {
                onSubmit();
                setMsg("")
            }
        } 
        catch (error) {
            setMsg("Unable to delete application");
            console.log(error);
        }
    }

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
    }

    async function handleSubmit(event) {
        setMsg("Loading...")

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
            const response = await fetch("/api/application/editApplication", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
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
                if (data.error == "invalid/expired token") {
                    router.push("/Login-Page");
                }
                else if (data.error === "invalid/expired token") {
                    router.push("/Login-Page")
                }
                
                validateFields(data)
                return;
            }

            // setMsg("Application submitted successfully!");
            onSubmit();
            form.reset();
        } 
        catch (error) {
            setMsg("backend error");
            console.error(error);
        }
    }

    return (
        <div className={styles.div}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.del}>
                    <img onClick={handleDelete} src="/images/del.jpg" />
                </div>
                <div className={styles.close}>
                    <img onClick={onClose} src="/images/close.svg" />
                </div>
                <h1 className={styles.h1}>Edit Application</h1>
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
                    <input name="title" defaultValue={preTitle} className={title ? styles.errorInput : styles.input} type="text" placeholder="Job Title" required />
                    <input name="company" defaultValue={preCompany} className={company ? styles.errorInput : styles.input} type="text" placeholder="Company Name" required />

                    <input name="link" defaultValue={preLink} className={link ? styles.errorInput : styles.input} type="url" placeholder="Application Link (optional)" />
                    <input name="appliedDate" defaultValue={preDate} className={date ? styles.errorInput : styles.input} type="date" placeholder="Applied Date" />
                    <input name="folder" defaultValue={preFolder} className={folder ? styles.errorInput : styles.input} type="text" placeholder="Folder Name"/>

                    <div className={styles.centre}>
                        <button className={styles.button} type="submit">Update</button>
                    </div>
                </div>
                <p className={styles.err}>{msg}</p>
            </form>
        </div>
    );
}