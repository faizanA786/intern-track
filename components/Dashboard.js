import React, {useEffect, useState} from "react";
import { useRouter } from 'next/router';
import styles from './Dashboard.module.css';
import Link from "next/link";
import NewApplication from "./NewApplication";
import EditApplication from "./EditApplication";

export default function Dashboard() {
    const router = useRouter();
    const {id} = router.query;
    
    const [showForm, setShowForm] = useState(false);

    const[applied, setApplied] = useState(0);
    const[offer, setOffer] = useState(0);
    const[rejected, setRejected] = useState(0);

    const[forename, getForename] = useState("user");
    const[folders, setFolders] = useState([]); // with applications
    const[applications, setApplications] = useState([]);

    useEffect(() => { // run after render
        fetchFolders();
        getStats();
    }, [])

    useEffect(() => { // after apps are fetched 
        if (applications.length > 0) {
            getStats();
        }
    }, [applications]) //runs when applications state changes

    async function getStats() {
        let appliedCount = 0
        let rejectCount = 0
        let offerCount = 0

        try {
            for (let app of applications) {
                if (app.status == "Applied") {
                    appliedCount += 1
                }
                if (app.status == "Rejected") {
                    rejectCount += 1
                }
                if (app.status == "Offer") {
                    offerCount += 1
                }
            }
            setApplied(appliedCount);
            setRejected(rejectCount);
            setOffer(offerCount);
        }
        catch(error) {
            console.log(error);
        }
    }

    async function fetchFolders() { // and applications, refresh page
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
        }
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
            console.log(error);
        }
    }


    function handleNewApp(event) { 
        event.preventDefault();
        setShowForm(true);
    }

    function getTypeColour(type) {
        if (type === "Internship") { 
            return "#6ebd15ff";
        }
        if (type === "Placement") {
            return "#dd2121ff";
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

    return (
        <div className={styles.wrapper}>
            {showForm ? (<NewApplication onClose={() => setShowForm(false)} />) : null}
            {id ? (<EditApplication id={id} onClose={() => router.push("dashboard-page", undefined, { shallow: true })} />) : null}

            <div className={showForm  || id ? styles.blurContainer : styles.container}>
                <div className={ styles.filterContainer }>
                    <div className={styles.stat}>
                        <p>Applied: {applied}</p>
                        <p>Offer: {offer}</p>
                        <p>Rejected: {rejected}</p>
                    </div>
                    <select name="folder" className={styles.inputFilter} onChange={handleFolder}>
                        <option value="all">All</option>
                        {folders.map((name, index) => (
                            <option key={index} value={name}>{name}</option>
                        ))}
                    </select>
                    <button className={styles.new} type="button" onClick={handleNewApp}>Add Application</button>

                </div>
                <hr className={styles.hr}/>
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
                                    <a className={styles.a} onClick={() => router.push({ pathname: '/dashboard-page', query: { id: app._id } }, undefined, { shallow: true })}>
                                        {app.title}
                                    </a>                                
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