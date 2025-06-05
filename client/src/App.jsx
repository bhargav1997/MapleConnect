import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";

// Components
import MainLayout from "./components/layout/MainLayout";
import PrivateRoute from "./components/PrivateRoute";
import AuthRoute from "./components/AuthRoute";
import AdminLayout from "./components/admin/AdminLayout";

// Pages
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Marketplace from "./pages/Marketplace";
import ListingDetail from "./pages/ListingDetail";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import SearchResults from "./pages/SearchResults";
import NotFound from "./pages/NotFound";
import Discover from "./pages/Discover";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import ReportedPosts from "./pages/admin/ReportedPosts";
import Broadcast from "./pages/admin/Broadcast";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminOTPVerification from "./pages/admin/AdminOTPVerification";

// Support Pages
import Support from "./pages/support/Support";
import HelpCenter from "./pages/support/HelpCenter";
import CommunityGuidelines from "./pages/support/CommunityGuidelines";
import PrivacyPolicy from "./pages/support/PrivacyPolicy";
import TermsOfService from "./pages/support/TermsOfService";
import LoginOTPVerification from "./pages/LoginOTPVerification";

function App() {
   return (
      <Provider store={store}>
         <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
               <SocketProvider>
                  <AdminAuthProvider>
                     <MainLayout>
                        <Routes>
                           {/* Public Routes that redirect to Home if authenticated */}
                           <Route element={<AuthRoute />}>
                              <Route path='/' element={<LandingPage />} />
                              <Route path='/login' element={<Login />} />
                              <Route path='/register' element={<Register />} />
                              <Route path='/forgot-password' element={<ForgotPassword />} />
                              <Route path='/reset-password/:token' element={<ResetPassword />} />
                              <Route path='/otp-verify' element={<LoginOTPVerification />} />
                           </Route>

                           {/* Support Routes - accessible to all */}
                           <Route path='/support' element={<Support />} />
                           <Route path='/support/help-center' element={<HelpCenter />} />
                           <Route path='/support/community-guidelines' element={<CommunityGuidelines />} />
                           <Route path='/support/privacy-policy' element={<PrivacyPolicy />} />
                           <Route path='/support/terms-of-service' element={<TermsOfService />} />

                           {/* Protected Routes - require authentication */}
                           <Route element={<PrivateRoute />}>
                              <Route path='/home' element={<Home />} />
                              <Route path='/search' element={<SearchResults />} />
                              <Route path='/profile/:id' element={<Profile />} />
                              <Route path='/groups' element={<Groups />} />
                              <Route path='/groups/:id' element={<GroupDetail />} />
                              <Route path='/events' element={<Events />} />
                              <Route path='/events/:id' element={<EventDetail />} />
                              <Route path='/marketplace' element={<Marketplace />} />
                              <Route path='/marketplace/:id' element={<ListingDetail />} />
                              <Route path='/messages' element={<Messages />} />
                              <Route path='/messages/:userId' element={<Messages />} />
                              <Route path='/notifications' element={<Notifications />} />
                              <Route path='/settings' element={<Settings />} />
                              <Route path='/discover' element={<Discover />} />
                           </Route>

                           {/* Admin Routes */}
                           <Route path='/admin/login' element={<AdminLogin />} />
                           <Route path='/admin/verify-otp' element={<AdminOTPVerification />} />
                           <Route
                              path='/admin'
                              element={
                                 <AdminLayout>
                                    <Dashboard />
                                 </AdminLayout>
                              }
                           />
                           <Route
                              path='/admin/users'
                              element={
                                 <AdminLayout>
                                    <Users />
                                 </AdminLayout>
                              }
                           />
                           <Route
                              path='/admin/reported-posts'
                              element={
                                 <AdminLayout>
                                    <ReportedPosts />
                                 </AdminLayout>
                              }
                           />
                           <Route
                              path='/admin/broadcast'
                              element={
                                 <AdminLayout>
                                    <Broadcast />
                                 </AdminLayout>
                              }
                           />

                           {/* 404 Route */}
                           <Route path='*' element={<NotFound />} />
                        </Routes>
                     </MainLayout>
                  </AdminAuthProvider>
               </SocketProvider>
            </AuthProvider>
         </Router>
      </Provider>
   );
}

export default App;
