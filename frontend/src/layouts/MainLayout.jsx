import React from 'react'
import NavBar from '../components/NavBar'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/NavBar'

function MainLayout() {
  return (
    <>
      <Navbar/>
      <Outlet/>
    </>
  )
}

export default MainLayout
