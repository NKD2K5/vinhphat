import Image from 'next/image';
import { Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeamMemberProps {
  name: string;
  position: string;
  bio: string;
  image: string;
  linkedin?: string;
  email?: string;
}

export default function TeamMemberCard({ 
  name, 
  position, 
  bio, 
  image, 
  linkedin, 
  email 
}: TeamMemberProps) {
  // Handle missing or incorrect image paths
  const imageSrc = image.startsWith('/') ? image : `/images/team/${image}`;
  const fallbackImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackImage;
          }}
          unoptimized={imageSrc.startsWith('http')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="w-full">
            <p className="text-white text-sm mb-3 line-clamp-3">{bio}</p>
            <div className="flex space-x-2">
              {linkedin && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-8 w-8 bg-white/10 border-white/20 hover:bg-white/20 backdrop-blur-sm"
                  asChild
                >
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${name}'s LinkedIn`}>
                    <Linkedin className="h-4 w-4 text-white" />
                  </a>
                </Button>
              )}
              {email && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-8 w-8 bg-white/10 border-white/20 hover:bg-white/20 backdrop-blur-sm"
                  asChild
                >
                  <a href={`mailto:${email}`} aria-label={`Email ${name}`}>
                    <Mail className="h-4 w-4 text-white" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{name}</h3>
        <p className="text-sm text-muted-foreground dark:text-gray-300 line-clamp-2">{position}</p>
      </div>
    </div>
  );
}
