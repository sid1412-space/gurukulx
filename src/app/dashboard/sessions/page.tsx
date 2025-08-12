
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { sessionHistory } from '@/lib/mock-data';
import { BookOpen, Download } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

export default function SessionHistoryPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            My Sessions
        </h1>
        <p className="text-muted-foreground">Review your past tutoring sessions and access transcripts.</p>
      </header>
      
      <Card>
          <CardHeader>
              <CardTitle>Session History</CardTitle>
              <CardDescription>A complete log of all your completed sessions.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Tutor</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sessionHistory.map((session) => (
                    <TableRow key={session.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={session.tutorAvatar} alt={session.tutorName} data-ai-hint="person avatar"/>
                                    <AvatarFallback>{session.tutorName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{session.tutorName}</span>
                            </div>
                        </TableCell>
                        <TableCell>{session.subject}</TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span>{format(new Date(session.date), 'PPP')}</span>
                                <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(session.date), { addSuffix: true })}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell>{session.duration} min</TableCell>
                        <TableCell>${session.cost.toFixed(2)}</TableCell>
                        <TableCell>
                            <Badge variant={session.status === 'Completed' ? 'default' : 'outline'}>
                                {session.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           <Button variant="ghost" size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Transcript
                           </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
      </Card>
    </div>
  );
}

