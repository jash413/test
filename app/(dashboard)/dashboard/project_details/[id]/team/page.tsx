import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const teamMembers = [
  { id: 1, name: 'John Doe', role: 'Project Manager', image: '/path/to/john.jpg' },
  { id: 2, name: 'Jane Smith', role: 'Lead Developer', image: '/path/to/jane.jpg' },
  { id: 3, name: 'Bob Johnson', role: 'Designer', image: '/path/to/bob.jpg' },
];

export default function ProjectTeam({ params }: { params: { id: string } }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Team</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center space-x-4 p-4 bg-[hsl(var(--secondary))] rounded-lg">
              <Avatar>
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}