'use client';

import copy from "copy-to-clipboard";
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Header from "./components/header";

const INITAL_CONFIG = {
  width: '',
  height: '',
  dpr: '',
  expiry: '1',
  fit: '',
  gravity: '',
  quality: '',
  sharpen: '',
  format: '',
  animation: '',
  onError: '',
  metadata: ''
}

export default function Home() {
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, [])
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null)
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [config, setConfig] = useState(INITAL_CONFIG)

  const handleChange = (event) => {
    setConfig({
      ...config,
      [event.target.name]: event.target.value
    })
  }

  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setImageUrl(URL.createObjectURL(event.target.files[0]))
      document.getElementById('modalBtn').click()
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    for (let con in config) {
      if (config[con] && config[con].length) {
        formData.append(con, config[con])
      }
    }


    setUploading(true);
    setMessage('');

    try {
      let response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });


      if (response.ok) {
        response = await response.json()
        setMessage(`${window.location.origin}/${response.data.shortId}`);
      } else {
        response = await response.json()
        throw new Error(response.error)
      }
    } catch (error) {
      const {
        message = "Internal Server Error!"
      } = error;
      setMessage(message);
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  const resetValues = () => {
    setUploading(false);
    setConfig(INITAL_CONFIG);
    setSelectedFile(null);
    setMessage(null);
  }

  return (
    <>
      <Header />
      <main>
        <div className="row align-items-center">
          <div className="col-xxl-4 col-xl-4  col-lg-4 col-11 offset-1">
            <span className={styles.sub_heading}>Upload and share image.</span>
          </div>
          <div className="col-xxl-4 col-xl-4  col-lg-4  col-10 offset-1">
            <h2 className={styles.feature_heading}>Features</h2>
            <ul className={styles.feature_desc}>
              <li>
                Upload image in various formats (JPG, JPEG, PNG, GIF or WEBP).
              </li>
              <li>
                Optimize image load time and viewing experience.
              </li>
              <li>
                URL can be used to access for a limited amount of time.
              </li>
            </ul>
            <label
              type="button"
              className="btn btn-primary ls-1 px-xxl-4 py-xxl-2 px-xl-4 py-xl-2 px-lg-4 py-lg-2 rounded-0 float-end"
              htmlFor="selectFile"
            >
              Start Uploading
            </label>
            <input type="file" onClick={(e) => e.target.value = null} onChange={handleFileChange} className="d-none" id="selectFile" accept="image/*" />
            <button className="d-none" id="modalBtn"
              data-bs-toggle="modal"
              data-bs-target="#uploadModal"></button>
          </div>
        </div>

      </main>
      <div
        className="modal fade"
        id="uploadModal"
        tabIndex="-1"
        aria-hidden="true"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content rounded-0">
            <div className="modal-header">
              <h5 className="modal-title">
                Configure Image
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={resetValues}
              ></button>
            </div>
            <div className="modal-body">
              {
                message ?
                  <div className="row">
                    <div className="col text-center">
                      <em>{message}</em> <button type="button" className="ms-3 btn btn-sm btn-outline-secondary" onClick={() => copy(message)}>Copy</button>
                    </div>
                  </div>
                  :
                  <div className="row">
                    <div className="col-xxl-5 col-xl-5 col-lg-5 col-12 text-center">
                      {
                        imageUrl ?
                          <Image
                            className="img-fluid rounded-1"
                            src={imageUrl}
                            alt="Preview Image"
                            width={1000}
                            height={10}
                          />
                          : ''
                      }
                    </div>
                    <div className="col-xxl-7 col-xl-7 col-lg-7 col-12 mt-xxl-0 mt-xl-0 mt-lg-0 mt-3">
                      <form>
                        <div className="row mb-4 align-items-center">
                          <div className="col-2 text-end">
                            <label htmlFor="width">Width</label>
                          </div>
                          <div className="form-group col-4">
                            <input type="number" className="form-control form-control-sm" id="width" name="width" placeholder="Width" value={config.width} onChange={handleChange} />
                          </div>
                          <div className="col-2 text-end">
                            <label htmlFor="height">Height</label>
                          </div>
                          <div className="form-group col-4">
                            <input type="number" className="form-control form-control-sm" id="height" name="height" placeholder="Height" value={config.height} onChange={handleChange} />
                          </div>
                        </div>
                        <div className="row mb-4 align-items-center">
                          <div className="col-2 text-end">
                            <label htmlFor="dpr">DPR</label>
                          </div>
                          <div className="form-group col-4">
                            <input type="number" className="form-control form-control-sm" id="dpr" name="dpr" placeholder="DPR" value={config.dpr} onChange={handleChange} />
                          </div>
                          <div className="col-2 text-end">
                            <label htmlFor="expiry">Expiry</label>
                          </div>
                          <div className="form-group col-4">
                            <select className="form-select form-select-sm" id="expiry" name="expiry" value={config.expiry} onChange={handleChange}>
                              <option value="1">1 min</option>
                              <option value="3">3 min</option>
                              <option value="5">5 min</option>
                              <option value="10">10 min</option>
                              <option value="15">15 min</option>
                            </select>
                          </div>
                        </div>
                        <div className="row mb-4 align-items-center">
                          <div className="col-2 text-end">
                            <label htmlFor="fit">Fit</label>
                          </div>
                          <div className="form-group col-4">
                            <select className="form-select form-select-sm" id="fit" name="fit" value={config.fit} onChange={handleChange}>
                              <option value={""} disabled>Select...</option>
                              <option value="scaleDown">Scale Down</option>
                              <option value="contain">Contain</option>
                              <option value="cover">Cover</option>
                              <option value="crop">Crop</option>
                              <option value="pad">Pad</option>
                            </select>
                          </div>
                          <div className="col-2 text-end">
                            <label htmlFor="gravity">Gravity</label>
                          </div>
                          <div className="form-group col-4">
                            <select className="form-select form-select-sm" id="gravity" name="gravity" value={config.gravity} onChange={handleChange}>
                              <option value={""} disabled>Select...</option>
                              <option value="auto">Auto</option>
                              <option value="side">Side</option>
                            </select>
                          </div>
                        </div>
                        <div className="row mb-4 align-items-center">
                          <div className="col-2 text-end">
                            <label htmlFor="quality">Quality</label>
                          </div>
                          <div className="form-group col-4">
                            <input type="number" className="form-control form-control-sm" id="quality" name="quality" placeholder="Quality" value={config.quality} onChange={handleChange} />
                          </div>
                          <div className="col-2 text-end">
                            <label htmlFor="sharpen">Sharpen</label>
                          </div>
                          <div className="form-group col-4">
                            <input type="number" className="form-control form-control-sm" id="sharpen" name="sharpen" placeholder="Sharpen" value={config.sharpen} onChange={handleChange} />
                          </div>
                        </div>
                        <div className="row mb-4 align-items-center">
                          <div className="col-2 text-end">
                            <label htmlFor="format">Format</label>
                          </div>
                          <div className="form-group col-4">
                            <select className="form-select form-select-sm" id="format" name="format" value={config.format} onChange={handleChange}>
                              <option value={""} disabled>Select...</option>
                              <option value="auto">Auto</option>
                              <option value="webp">WebP</option>
                            </select>
                          </div>
                          <div className="col-2 text-end">
                            <label htmlFor="animation">Animation</label>
                          </div>
                          <div className="form-group col-4">
                            <select id="animation" name="animation" className="form-select form-select-sm" value={config.animation} onChange={handleChange}>
                              <option value={""} disabled>Select...</option>
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </select>
                          </div>
                        </div>
                        <div className="row align-items-center mb-5">
                          <div className="col-2 text-end">
                            <label htmlFor="onError">On Error</label>
                          </div>
                          <div className="form-group col-4">
                            <select id="onError" name="onError" className="form-select form-select-sm" value={config.onError} onChange={handleChange}>
                              <option value={""} disabled>Select...</option>
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </select>
                          </div>
                          <div className="col-2 text-end">
                            <label htmlFor="metadata">MetaData</label>
                          </div>
                          <div className="form-group col-4">
                            <select id="metadata" name="metadata" className="form-select form-select-sm" value={config.metadata} onChange={handleChange}>
                              <option value={""} disabled>Select...</option>
                              <option value="none">None</option>
                              <option value="keep">Keep</option>
                              <option value="copyright">Copyright</option>
                            </select>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 text-center">
                            {
                              uploading ?
                                <button className="btn btn-danger rounded-0 px-3 ls-1" disabled>
                                  <div className="spinner-border text-light spinner-border-sm me-2" role="status">
                                  </div>
                                  Uploading
                                </button>
                                :
                                <button className="btn btn-danger rounded-0 px-4 ls-1" onClick={handleUpload}>
                                  Submit
                                </button>
                            }
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>

              }
            </div>
          </div>
        </div>
      </div>
    </>
  );

}
