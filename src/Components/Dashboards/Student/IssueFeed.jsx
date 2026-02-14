import React from 'react'
import SideNavLayout from '../Common/SideNavLayout';
import StudentSideNav from './StudentSideNav';
import axios from 'axios';
import BottomNav from '../../Templates/BottomNav';

const IssueFeed = () => {
    const issues = axios.get("/issues/feed");
  return (
    <>
    <StudentSideNav/>
    <BottomNav/>
    </>
  )
}

export default IssueFeed