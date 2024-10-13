'use client';

import Image from "next/image";
import styles from "../page.module.css";
import { useEffect, useState } from "react";
import Header from "../components/header";

export default function Home({ params }) {
    const {
        id
    } = params

    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                let response = await fetch(`/api/image/${id}`);
                if (response.ok) {
                    response = await response.json()
                    setData(response.data)
                } else {
                    response = await response.json()
                    throw new Error(response.error)
                }
                setLoading(false)
            } catch (error) {
                const {
                    message = "Internal Server Error!"
                } = error;
                setError(message)
                setLoading(false)
            }
        }
        if (id) {
            fetchData()
        }

        return () => { }
    }, [id])


    return (
        <>
            <Header />
            <main>
                <div className="row">
                    <div className="col-xxl-10 col-xl-10 col-lg-10 col-md-10 col-12 offset-xxl-1 offset-xl-1 offset-lg-1 offset-md-1 offset-0 px-xxl-0 px-xl-0 px-lg-0 px-md-0 px-4 text-center">
                        {
                            loading ?
                                <div className={styles.date_heading}>
                                    Loading...
                                </div>
                                :
                                error ?
                                    <div className={styles.sub_heading}>
                                        {error}
                                    </div>
                                    :
                                    data && data.url ?
                                        <>
                                            <div className={styles.date_heading}>
                                                Uploaded Date : {new Date(data.createdAt).toLocaleString()}
                                                <br />
                                                Expiry Date : {new Date(data.expiresAt).toLocaleString()}
                                            </div>
                                            <Image
                                                className="img-fluid rounded-1"
                                                src={data.url}
                                                alt="Image Uploaded"
                                                width={1000}
                                                height={10}
                                            />
                                        </>
                                        : ''

                        }
                    </div>
                </div>

            </main>
        </>
    );
}
