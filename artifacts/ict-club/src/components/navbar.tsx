
import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useRouter } from '@/lib/next-shim';
import { Menu, X, LogOut, User, Moon, Sun, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/contexts/theme-context';

const navItems = [
  { label: 'Team', href: '/team' },
  { label: 'Projects', href: '/projects' },
  { label: 'Events', href: '/events' },
  { label: 'Contact', href: '/contact' },
];

interface UserProfile {
  full_name: string;
  avatar_url: string;
  member_id: string;
  role: string;
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, loading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (data.user) {
        setProfile({
          full_name: data.user.full_name,
          avatar_url: data.user.avatar_url,
          member_id: data.user.userId,
          role: data.user.role,
        });
      }
    } catch (error) {
      console.error('[v0] Error fetching profile:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 mx-4 my-4 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/ictclubNJBS.jpg"
              alt="ICT Club Logo"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <span className="font-bold text-lg hidden sm:inline">
              ICT Club
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-foreground/80 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Theme Toggle & Auth Buttons */}
          <div className="hidden sm:flex items-center gap-3 relative">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-foreground/80 hover:bg-primary/10 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {loading ? (
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-foreground/80 hover:bg-primary/10 transition-colors"
                >
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center">
                      <User size={12} />
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs font-medium">
                    {profile?.member_id || user.email?.split('@')[0]}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-card/40 backdrop-blur-xl border border-border/50 rounded-lg py-2 z-50">
                    <div className="px-4 py-3 border-b border-border/50">
                      <p className="font-semibold text-sm">
                        {profile?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-foreground/60">
                        {profile?.member_id || user.email}
                      </p>
                      <p className="text-xs text-primary mt-1 capitalize">
                        {profile?.role || 'member'}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Edit Profile
                    </Link>

                    {(profile?.role === 'admin' ||
                      user?.email === 'sangamkunwar48@gmail.com') && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-colors flex items-center gap-2"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings size={14} />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-foreground/80 hover:text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2 border-t border-border/50"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button size="sm" className="bg-primary text-primary-foreground" asChild>
                  <Link href="/auth/signup">Join</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border/50">
            <div className="flex flex-col gap-2 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-sm text-foreground/80 hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
