import React, {useEffect, useState} from "react";
import { useRouter } from 'next/router';
import styles from './Dashboard.module.css';
import Link from "next/link";

export default function Dashboard() {
    const router = useRouter();
    
    const[forename, getForename] = useState("user");
    const[folders, setFolders] = useState([]);
    const[applications, setApplications] = useState([]);

    useEffect(() => { // run after render
        const fetchFolders = async () => {
            try { // init folder
                const response = await fetch("/api/folder", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    },
                    body: JSON.stringify({
                        folder: "all"
                    })
                });
                const data = await response.json();
                if (data.length === 0) {
                    console.log("empty");
                    router.push('/newapp-page'); 
                }
                const folderNames = [...new Set(data.map(app => app.folder))];
                setFolders(folderNames);
                setApplications(data);
            }
            catch(error) {
                console.log(error);
                router.push("/login-page")
            }
        }
        fetchFolders();
    }, [])

    function handleNewApp(event) {
        router.push("/newapp-page");
    }

    function getTypeColour(type) {
        if (type === "Internship") { 
            return "#9370DB";
        }
        if (type === "Placement") {
            return "#20B2AA";
        }
        return "black";
    }

    function getStatusColour(type) {
        if (type === "Offer") { 
            return "#82db70ff";
        }
        if (type === "Interview") {
            return "#34cacaff";
        }
        if (type === "Rejected") {
            return "#ca3434ff";
        }
        if (type === "Applied") {
            return "#ccbf0eff";
        }
        return "black";
    }

    async function handleFolder(event) {
        const selected = event.target.value;
        try {
            const response = await fetch("/api/folder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({
                    folder: selected
                })
            });
            const data = await response.json();
            setApplications(data);
        }
        catch(error) {
            setMsg("Internal server error");
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.stat}>
                <h1>Welcome back {forename}!</h1>
                <div>
                    <p>Applied: 69</p>
                    <p>Rejected: 420</p>
                </div>
                <div>
                    <p>Interview: -1201</p>
                    <p>Offer: -402</p>
                </div>
            </div>
            <div className={styles.container}>
                <div className={styles.filterContainer}>
                    <input className={styles.input} type="search" placeholder="Filter by Type, Title..."/>
                    <select name="folder" className={styles.inputFilter} onChange={handleFolder}>
                        <option value="all">All</option>
                        {folders.map((name, index) => (
                            <option key={index} value={name}>{name}</option>
                        ))}
                    </select>
                    <button className={styles.new} type="submit" onClick={handleNewApp}>Add Application</button>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.headers}>
                            <th>Type</th>
                            <th>Title</th>
                            <th>Company</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app, index) => (
                            <tr key={index} className={styles.entry}>
                                <td style= {{ color: getTypeColour(app.type) }} >{app.type}</td>
                                <td>
                                    <Link className={styles.a} href={"/editapp-page/" + app._id}>{app.title}</Link>
                                </td>
                                <td>{app.company}</td>
                                <td style = {{ color: getStatusColour(app.status) }}> {app.status}</td>
                                <td>{app.appliedDate?.split("T")[0]}</td>      
                            </tr>                  
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}