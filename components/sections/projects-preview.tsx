'use client';

import Link from 'next/link';
import { ChevronRight, Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface Project {
  id: string; 
  title: string;
  description: string;
  technologies: string[];
  status: string;
  link?: string;
  github?: string;
}

export default function ProjectsPreview() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // 1. Fix Hydration Issues (removeChild error)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        
        // If the API returns HTML (404/500), this prevents the SyntaxError
        if (!res.ok) throw new Error('Network response was not ok');
        
        const data = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data.slice(0, 2));
        } else {
          throw new Error('No data found');
        }
      } catch (error) {
        console.error('Fetch failed, using local fallback:', error);
        // Fallback data if API or Database is down
        setProjects([
          {
            id: 'fallback-1',
            title: 'ICT Club Portal',
            description: 'Digital infrastructure for the NJBS ICT Club community.',
            technologies: ['Next.js', 'Supabase', 'Tailwind'],
            status: 'Active',
          },
          {
            id: 'fallback-2',
            title: 'Drone Controller',
            description: 'Flight control system utilizing Arduino and MPU-6050 sensors.',
            technologies: ['C++', 'Arduino', 'Robotics'],
            status: 'In Progress',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (mounted) fetchProjects();
  }, [mounted]);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) return null;

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-foreground/50 animate-pulse">Loading Projects...</p>
      </div>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Featured Projects</h2>
            <p className="text-foreground/70">Showcasing our latest innovations</p>
          </div>
          <Button variant="ghost" className="text-primary hover:bg-primary/10 gap-2" asChild>
            <Link href="/projects">
              View All <ChevronRight size={18} />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="glass bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl transition-all duration-300 hover:border-primary/40 p-8 group flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary">
                  {project.status}
                </span>
              </div>
              
              <p className="text-foreground/70 mb-6 flex-grow">
                {project.description}
              </p>
              
              <div className="flex gap-2 flex-wrap mb-6">
                {project.technologies?.map((tech) => (
                  <span key={tech} className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 pt-4 border-t border-border/50">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-foreground/60 hover:text-primary">
                    <Github size={16} /> Code
                  </a>
                )}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-foreground/60 hover:text-primary">
                    <ExternalLink size={16} /> Live
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}