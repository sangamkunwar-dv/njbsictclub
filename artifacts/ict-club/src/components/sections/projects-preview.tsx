
import { Link } from 'wouter';
import { ChevronRight, Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  status: string;
  link?: string;
  github?: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        // Get top 2 featured projects
        setProjects(data.slice(0, 2));
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        // Fallback to default projects
        setProjects([
          {
            _id: '1',
            title: 'Design System',
            description: 'Comprehensive component library for rapid UI development',
            technologies: ['Design', 'Components', 'Documentation'],
            status: 'Active',
          },
          {
            _id: '2',
            title: 'Innovation Lab',
            description: 'Experimental projects exploring emerging technologies',
            technologies: ['AI', 'WebGL', 'Research'],
            status: 'In Progress',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-foreground/70">Loading featured projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Featured Projects</h2>
            <p className="text-foreground/70">Showcasing the work of our collective</p>
          </div>
          <Button
            variant="ghost"
            className="text-primary hover:bg-primary/10 gap-2"
            asChild
          >
            <Link href="/projects">
              View All
              <ChevronRight size={18} />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="glass bg-card/40 backdrop-blur-xl border border-border/50 rounded-xl transition-all duration-300 hover:bg-card/60 hover:border-primary/50 p-8 rounded-2xl group flex flex-col"
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
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-1 rounded-md bg-border/50 text-foreground/70"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-4 border-t border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-foreground/70 hover:text-primary"
                >
                  <Github size={16} />
                  Code
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-foreground/70 hover:text-primary"
                >
                  <ExternalLink size={16} />
                  Live
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
