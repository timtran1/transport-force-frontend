import CronCreate from "./routes/admin/cron/CronCreate.jsx";
import CronEdit from "./routes/admin/cron/CronEdit.jsx";
import CronView from "./routes/admin/cron/CronView.jsx";
import CronList from "./routes/admin/cron/CronList.jsx";
import BlogPostCreate from "./routes/admin/blog_post/BlogPostCreate.jsx";
import BlogPostEdit from "./routes/admin/blog_post/BlogPostEdit.jsx";
import BlogPostView from "./routes/admin/blog_post/BlogPostView.jsx";
import BlogPostList from "./routes/admin/blog_post/BlogPostList.jsx";
import TrackingSessionView from "./routes/admin/tracking_session/TrackingSessionView.jsx";
import TrackingSessionList from "./routes/admin/tracking_session/TrackingSessionList.jsx";
import TrackingOverview from "./routes/admin/tracking_session/TrackingOverview.jsx";
import TrackingLayout from "./components/layouts/TrackingLayout.jsx";
import SiteContentEdit from "./routes/admin/site_content/SiteContentEdit.jsx";
import SiteContentView from "./routes/admin/site_content/SiteContentView.jsx";
import SiteContentList from "./routes/admin/site_content/SiteContentList.jsx";
import CMSLayout from "./components/layouts/CMSLayout.jsx";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import WebsiteLayout from "./components/layouts/WebsiteLayout.jsx";
import Home from "./routes/website/Home.jsx";
import NotFound404 from "./routes/website/NotFound404.jsx";
import RequireAuth from "./common/auth/RequireAuth.jsx";
import PublicAuth from "./common/auth/PublicAuth.jsx";
import Login from "./routes/auth/Login.jsx";
import ResetPasswordConfirmation from "./routes/auth/ResetPasswordConfirmation.jsx";
import UserList from "./routes/admin/user/UserList.jsx";
import UserEdit from "./routes/admin/user/UserEdit.jsx";
import UserView from "./routes/admin/user/UserView.jsx";
import UserCreate from "./routes/admin/user/UserCreate.jsx";
import RoleList from "./routes/admin/role/RoleList.jsx";
import RoleEdit from "./routes/admin/role/RoleEdit.jsx";
import RoleView from "./routes/admin/role/RoleView.jsx";
import RoleCreate from "./routes/admin/role/RoleCreate.jsx";
import OrganizationLayout from "./components/layouts/OrganizationLayout.jsx";
import ResetPassword from "./routes/auth/ResetPassword.jsx";
import OrganizationSettings from "./routes/admin/organization/OrganizationSettings.jsx";
import EmailTemplateList from "./routes/admin/email_template/EmailTemplateList.jsx";
import EmailTemplateView from "./routes/admin/email_template/EmailTemplateView.jsx";
import EmailTemplateEdit from "./routes/admin/email_template/EmailTemplateEdit.jsx";
import SMTPSettings from "./routes/admin/organization/SMTPSettings.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicAuth/>}>
                    <Route element={<WebsiteLayout/>}>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/reset-password-confirmation/:token" element={<ResetPasswordConfirmation/>}/>
                        <Route path="/reset-password" element={<ResetPassword/>}/>

                        <Route path="*" element={<NotFound404/>}/>
                    </Route>
                </Route>


                <Route element={<RequireAuth/>}>
                    <Route element={<CMSLayout/>}>
                        <Route path="/theme_translations" element={<SiteContentList/>}/>
                        {/*<Route path="/theme_translations/create" element={<SiteContentCreate />}/>*/}
                        <Route path="/theme_translations/:id/edit" element={<SiteContentEdit/>}/>
                        <Route path="/theme_translations/:id" element={<SiteContentView/>}/>
                        <Route path="/blog_posts" element={<BlogPostList/>}/>
                        <Route path="/blog_posts/create" element={<BlogPostCreate/>}/>
                        <Route path="/blog_posts/:id/edit" element={<BlogPostEdit/>}/>
                        <Route path="/blog_posts/:id" element={<BlogPostView/>}/>
                    </Route>

                    <Route element={<OrganizationLayout/>}>
                        <Route path="/profile/:id/edit" element={<UserEdit/>}/>
                        <Route path="/users" element={<UserList/>}/>
                        <Route path="/users/:id/edit" element={<UserEdit/>}/>
                        <Route path="/users/:id" element={<UserView/>}/>
                        <Route path="/users/create" element={<UserCreate/>}/>
                        <Route path="/roles" element={<RoleList/>}/>
                        <Route path="/roles/:id/edit" element={<RoleEdit/>}/>
                        <Route path="/roles/:id" element={<RoleView/>}/>
                        <Route path="/roles/create" element={<RoleCreate/>}/>
                        <Route path="/email_templates" element={<EmailTemplateList/>}/>
                        <Route path="/email_templates/:id" element={<EmailTemplateView/>}/>
                        <Route path="/email_templates/:id/edit" element={<EmailTemplateEdit/>}/>
                        <Route path="/organization-settings" element={<OrganizationSettings/>}/>
                        <Route path="/crons" element={<CronList/>}/>
                        <Route path="/crons/create" element={<CronCreate/>}/>
                        <Route path="/crons/:id/edit" element={<CronEdit/>}/>
                        <Route path="/crons/:id" element={<CronView/>}/>
                        <Route path="/smtp-settings" element={<SMTPSettings/>}/>
                    </Route>

                    <Route element={<TrackingLayout/>}>
                        <Route path="/tracking_sessions" element={<TrackingSessionList/>}/>
                        <Route path="/tracking_sessions/:id" element={<TrackingSessionView/>}/>
                        <Route path="/tracking_overview" element={<TrackingOverview/>}/>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
