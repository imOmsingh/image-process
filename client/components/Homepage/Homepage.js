import React from 'react'
import styles from '@/styles/Homepage.module.css'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import axios from 'axios'
import {API_BASE_URL} from '../../endpoints'
import logo from "../../public/fpLogo.svg";
import Compressor from 'compressorjs';
import imageCompression from 'browser-image-compression';

export default function Homepage() {
    const menu = useRef(null)
    const imagecont = useRef(null)
    const [imagesArray, setImagesArray] = useState(["image-1703068628462.jpeg"])
    const [mainImage, setMainImage] = useState("");

    let menuopenclose = false;

    const openMenu = () => {
        if(!menuopenclose){
            menu.current.style.width = "0%"
            imagecont.current.style.width = "100%"
            menuopenclose = true;
        }
        else{
            menu.current.style.width = "25%"
            imagecont.current.style.width = "75%"
            menuopenclose = false;
        }
    }

    const [name, setName] = useState("")
    const [details, setDetails] = useState({})
    



    useEffect(() => {
      
        const getAllImages = async () =>{
            try {
                const res = await axios.get(`${API_BASE_URL}/api/image/getFileName`);
                console.log(res.data)
                setImagesArray(res.data.fileNames)
                setMainImage(res.data.fileNames[0])
                setDetails(res.data.metadata[0].information);
                setName(res.data.fileNames[0]);
                // setHeight(res.data[0].height);
                // setWidth(res.data[0].width);
            } catch (error) {
                console.log(error)
            }
            
        }

        getAllImages();

    }, [])


    const getImageData = async (filename) =>{
        setMainImage(filename);
        setName(filename)
        try {
            const res = await axios.post(`${API_BASE_URL}/api/image/singlemetadata`,{fileName:filename})
            setDetails(res.data.metadata[0].information);

        } catch (error) {
            console.log(error)
        }
        

    }

    const [compressedFile, setCompressedFile] = useState(null);
  
    async function handleImageUpload(event) {

        const imageFile = event.target.files[0];
        console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
        console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
      
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        }
        try {
          const compressedFile = await imageCompression(imageFile, options);
          console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
          console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
      
          await uploadToServer(compressedFile); // write your own logic
        } catch (error) {
          console.log(error);
        }
      
      }
    

  return (
    <div className={styles.back}>
        <div className={styles.header}>
            <div>
            <Image
                priority
                src={logo}
                alt="FPlogo"
                style={{width:'100px'}}
                />
            </div>
            <div onClick={openMenu} style={{color:'pink', cursor:'pointer'}}>
                <div className={styles.menuLine}></div>
                <div className={styles.menuLine}></div>
                <div className={styles.menuLine}></div>
            </div>
        </div>
        <div className={styles.maincont}>
            <div ref={imagecont} className={styles.imagecont}>
            <div className={styles.smallText}>Showing {imagesArray.length} photos</div>

                <div className={styles.bigImage}>

                        <img src={`${API_BASE_URL}/images/${mainImage}`}/>
                </div>
                <div className={styles.imageSelectorCont}>
                    {
                        imagesArray.map((item, idx)=>{
                            return(
                                <div key = {idx} onClick={()=>{getImageData(item)}} style={item.fileName == mainImage ? {border:"1px solid #999999", padding:'5px'} : {border:"none"} } className={styles.singleImage}>
                                    {/* <img src={`${API_BASE_URL}/images/${item}`}/> */}
                                    <img
                                        src={`${API_BASE_URL}/images/${item}`}
                                        width={500}
                                        height={500}
                                        quality={10}
                                        />
                                </div>
                            )
                        })
                    }
                </div>

            </div>
            <div ref={menu} className={styles.menu}>


                <div className={styles.properties}>
                    <div className={styles.text}>About Image</div>
                    <div className={styles.text2}>ISO - &nbsp; {details.ISO}</div>
                    <div className={styles.text2}>Lens AF - &nbsp; {details.Lens}</div>
                    <div className={styles.text2}>Capture Time - {details.CreateDate}</div>
                    <div className={styles.text2}>ShutterSpeed - {details.ShutterSpeed}</div>
                    <div className={styles.text2}>Aperture - &nbsp; {details.Aperture}</div>
                    <div className={styles.text2}>fileName - &nbsp; {name}</div>
                    <div className={styles.text2}>ImageHeight - &nbsp; {details.ImageHeight} </div>
                    <div className={styles.text2}>ImageWidth - &nbsp; {details.ImageWidth}</div>
                    <div className={styles.text2}>WhiteBalance - {details.WhiteBalance}</div>
                    <div className={styles.text2}>Rating - {details.Rating}</div>
                    <div className={styles.text2}>Color - {details.ColorSpace}</div>
                    <div className={styles.text2}>Camera - {details.CameraProfile}</div>
                    <div className={styles.text2}>Camera - {details.CameraProfile}</div>

                </div>
                <div className={styles.downloadBody}>
                    <a className={styles.download} href={`http://localhost:3000/api/image/download/${name}`}>
                        Download
                    </a>
                </div>
            </div>
        </div>    
    </div>
  )
}

