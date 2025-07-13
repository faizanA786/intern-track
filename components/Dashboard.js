import React, {useState} from "react";
import styles from './Dashboard.module.css';

export default function Dashboard() {
    const[forename, getForename] = useState("user");

    async function handleFolder(event) {

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
                    <select className={styles.inputFilter}>
                        <option selected>All</option>
                    </select>
                    <button className={styles.new}>Add Application</button>
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
                        <tr className={styles.entry}>
                            <td>Internship</td>
                            <td>Software Engineering  </td>
                            <td>test</td>
                            <td>tawdwadawdest</td>
                            <td>test</td>
                        </tr>
                        <tr className={styles.entry}>
                            <td>test</td>
                            <td>test</td>
                            <td>test</td>
                            <td>test</td>
                            <td>test</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}