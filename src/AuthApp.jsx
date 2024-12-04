import './App.css';
import './components/Login.jsx';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import { ProtectedRouteLogin } from './components/ProtectedRoutes';
import NavBar from './components/navBar.jsx';
import Header from './components/header.jsx';
import { AppShell } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import Footer from './components/Footer.jsx';
import OwnPost from './components/OwnPost.jsx';
import AllPost from './components/AllPost.jsx';
import AllUsers from './components/AllUsers.jsx';
import Logout from './components/Logout.jsx';
import AllCategories from './components/AllCategories.jsx';
import CreatePost from './components/CreatePost.jsx';
import CreateCategory from './components/CreateCategory.jsx';
import CreateUser from './components/CreateUser.jsx';
import ErrorPage from './components/404.jsx';
import Profile from './components/Profile.jsx';
import ProfileEdit from './components/ProfileEdit.jsx';
import PostInf from './components/PostInfo.jsx';
import PostEdit from './components/PostEdit.jsx';
import UserEdit from './components/UserEdit.jsx';
import CategoryEdit from './components/CategoryEdit.jsx';
import CategoryDelete from './components/CategoryDelete.jsx';
import PostDelete from './components/PostDelete.jsx';
import UserDelete from './components/UserDelete.jsx';

function AuthApp() {
    const [opened, { toggle }] = useDisclosure(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');
    return (
        <AppShell
        header={{ height: 80 }}
        navbar={{
            width: 300,
            breakpoint: 'sm',
            collapsed: { mobile: !opened },
        }}
        padding="md" layout={isDesktop ? "alt" : "default"} withBorder={false}>
            <Header opened={opened} toggle={toggle} />
            <NavBar />
        
            <Routes>
                <Route element={<ProtectedRouteLogin/>}>
                    <Route path='/' element={<Main />}/>
                    <Route path='/own-posts' element={<OwnPost />}/>
                    <Route path='/posts' element={<AllPost/>}/>
                    <Route path='/users' element={<AllUsers/>}/>
                    <Route path='/logout' element={<Logout/>}/>
                    <Route path='/categories' element={<AllCategories/>}/>
                    <Route path='/create-post' element={<CreatePost/>}/>
                    <Route path='/create-category' element={<CreateCategory/>}/>
                    <Route path='/create-user' element={<CreateUser/>}/>
                    <Route path='/profile' element={<Profile/>}/>
                    <Route path='/profile-edit' element={<ProfileEdit/>}/>
                    <Route path='/posts/:id' element={<PostInf/>}/>
                    <Route path='/post-edit/:id' element={<PostEdit/>}/>
                    <Route path='/post-delete/:id' element={<PostDelete/>}/>
                    <Route path='/user-edit/:id' element={<UserEdit/>}/>
                    <Route path='/user-delete/:id' element={<UserDelete/>}/>
                    <Route path='/category-edit/:id' element={<CategoryEdit/>}/>
                    <Route path='/category-delete/:id' element={<CategoryDelete/>}/>
                    <Route path='*' element={<ErrorPage/>} />
                </Route>
            </Routes>
        
            <Footer />
        </AppShell>
    );
}
  
export default AuthApp;
  