import { Switch, Route, Router as WouterRouter } from 'wouter';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/contexts/theme-context';
import CookieBanner from '@/components/CookieBanner';

import HomePage from '@/app/page';
import TeamPage from '@/app/team/page';
import ProjectsPage from '@/app/projects/page';
import EventsPage from '@/app/events/page';
import ContactPage from '@/app/contact/page';
import DashboardPage from '@/app/dashboard/page';
import ProfilePage from '@/app/profile/page';
import AdminPage from '@/app/admin/page';
import CodePage from '@/app/code/page';
import PrivacyPage from '@/app/privacy-policy/page';
import TermsPage from '@/app/terms/page';
import LoginPage from '@/app/auth/login/page';
import SignupPage from '@/app/auth/signup/page';
import ForgotPasswordPage from '@/app/auth/forgot-password/page';
import ResetPasswordPage from '@/app/auth/reset-password/page';
import AuthErrorPage from '@/app/auth/error/page';
import NotFound from '@/pages/not-found';

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/team" component={TeamPage} />
      <Route path="/projects" component={ProjectsPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/code" component={CodePage} />
      <Route path="/privacy-policy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/signup" component={SignupPage} />
      <Route path="/auth/forgot-password" component={ForgotPasswordPage} />
      <Route path="/auth/reset-password" component={ResetPasswordPage} />
      <Route path="/auth/error" component={AuthErrorPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AppRoutes />
          <CookieBanner />
        </WouterRouter>
        <Toaster />
        <SonnerToaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
