import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import {API_BASE_URL} from '../../endpoints'
import Homepage from '../../components/Homepage/Homepage'


const inter = Inter({ subsets: ['latin'] })
export default function Home() {

  return (
    <>
      <Homepage/>
    </>
  )
}
