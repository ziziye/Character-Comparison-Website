import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../components/NavBar';
import TopBar from '../components/TopBar';
import DetailCharacters from '../components/DetailCharacters';
import UserManagement from '../components/UserManagement';
import { useUser } from '../contexts/UserContext';
import UserHistory from '../components/UserHistory';
import MyUserProfile from '../components/MyUserProfile';
import Homepage  from '../components/Homepage';
import ChangeHistory from '../components/ChangeHistory';import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import HistoryIcon from '@mui/icons-material/History';
export default function UserProfile() {
  const router = useRouter();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('homepage');
  const tabData = [
    { id:'homepage', label:'Homepage',icon: <HomeIcon />},
    { id: 'myUserProfile', label:'My Profile',icon :<AccountCircleIcon />},
    { id: 'detailCharacters', label: 'Characters Information',icon:<PeopleAltIcon /> },
  ];

  if (user?.isAdmin) {
    tabData.push({ id: 'users', label: 'User Management' , icon:<ManageHistoryIcon />});
    tabData.push({ id: 'userHistory', label:'Approval Hub', icon:<ChecklistRtlIcon />});
    tabData.push({ id: 'changeHistory', label:'Change History', icon:<HistoryIcon />});
  }

  // logout
  const handleLogout = () => {
    // Forced jump to login page
    router.push('/signin');
  };

  useEffect(() => {
    if (!user?.userId) {
      router.push('/signin');
    } 
    window.onpopstate = () => { 
      history.go(1);
    };
  }, [user, router]);

  return (
    <>
      <div className='background background-image-blur-whitewash'></div>
      <TopBar user={user} onLogout={handleLogout} />
      <NavBar tabs={tabData} activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'homepage' && <Homepage />} 
      {activeTab === 'myUserProfile' && <MyUserProfile />} 
      {activeTab === 'detailCharacters' && <DetailCharacters />}
      {activeTab === 'userHistory' && <UserHistory/>}
      {activeTab === 'users' && <UserManagement />}
        {activeTab === 'changeHistory' && <ChangeHistory/>}
    </>
  );
}
