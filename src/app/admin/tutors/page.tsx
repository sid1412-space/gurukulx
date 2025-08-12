
'use client';

import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { useIsClient } from '@/hooks/use-is-client';
import { Label } from '@/components/ui/label';

type Applicant = {
    id: string;
    name: string;
    email: string;
    subject: string;
    status: 'Pending' | 'Approved' | 'Rejected';
};

export default function TutorManagementPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const { toast } = useToast();
  const isClient = useIsClient();
  const [approvingApplicant, setApprovingApplicant] = useState<Applicant | null>(null);
  const [tutorRate, setTutorRate] = useState<number | string>('');

  useEffect(() => {
    if (isClient) {
        const storedApplicants = localStorage.getItem('tutorApplicants');
        if (storedApplicants) {
            setApplicants(JSON.parse(storedApplicants));
        }
    }
  }, [isClient]);

  const updateLocalStorage = (updatedApplicants: Applicant[]) => {
    localStorage.setItem('tutorApplicants', JSON.stringify(updatedApplicants));
  };


  const handleApprove = () => {
    if (!approvingApplicant || !tutorRate || +tutorRate <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Rate',
        description: 'Please enter a valid positive number for the hourly rate.',
      });
      return;
    }

    // Update the status in the applicants list
    const updatedApplicants = applicants.map(applicant =>
      applicant.id === approvingApplicant.id ? { ...applicant, status: 'Approved' } : applicant
    );
    setApplicants(updatedApplicants);
    updateLocalStorage(updatedApplicants);

    // Add them to the main user database as a tutor with the specified rate
    try {
      const usersJSON = localStorage.getItem('userDatabase') || '[]';
      const users = JSON.parse(usersJSON);

      // Prevent duplicate entries
      if (!users.some((u: any) => u.email === approvingApplicant.email)) {
        users.push({
          email: approvingApplicant.email,
          role: 'tutor',
          name: approvingApplicant.name,
          price: +tutorRate // Save the hourly rate
        });
        localStorage.setItem('userDatabase', JSON.stringify(users));
      }
    } catch (error) {
      console.error('Failed to update user database:', error);
      toast({
        variant: 'destructive',
        title: 'Error Approving Applicant',
        description: `Could not add ${approvingApplicant.name} to the user list.`,
      });
      return;
    }

    toast({
      title: `Applicant Approved`,
      description: `${approvingApplicant.name} has been approved with an hourly rate of ₹${tutorRate}.`,
    });
    
    // Reset states
    setApprovingApplicant(null);
    setTutorRate('');
  };
  
  const handleReject = (id: string) => {
    const applicantToUpdate = applicants.find(applicant => applicant.id === id);
    if (!applicantToUpdate) return;
    
    const updatedApplicants = applicants.map(applicant => 
      applicant.id === id ? { ...applicant, status: 'Rejected' } : applicant
    );
    setApplicants(updatedApplicants);
    updateLocalStorage(updatedApplicants);
    
     toast({
      title: `Applicant Rejected`,
      description: `${applicantToUpdate.name} has been rejected.`,
    });
  }


  const handleViewApplication = (applicantName: string) => {
    toast({
      title: 'Viewing Application',
      description: `Opening application for ${applicantName}. (This is a placeholder action).`,
    });
  };

  const getBadgeVariant = (status: 'Pending' | 'Approved' | 'Rejected') => {
    switch (status) {
      case 'Approved':
        return 'default';
      case 'Rejected':
        return 'destructive';
      case 'Pending':
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Tutor Management</h1>
        <p className="text-muted-foreground">Approve new applicants and manage existing tutors.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>New Tutor Applications</CardTitle>
          <CardDescription>Review and process new applications to join the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Primary Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.map((applicant) => (
                <TableRow key={applicant.id} className={applicant.status !== 'Pending' ? 'opacity-50' : ''}>
                  <TableCell className="font-medium">{applicant.name}</TableCell>
                  <TableCell>{applicant.email}</TableCell>
                  <TableCell>{applicant.subject}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(applicant.status)}>
                      {applicant.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     {applicant.status === 'Pending' ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewApplication(applicant.name)}>View Application</DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-green-600 focus:text-green-600"
                            onClick={() => setApprovingApplicant(applicant)}
                          >
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600"
                             onClick={() => handleReject(applicant.id)}
                          >
                            Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                       <span className="text-xs text-muted-foreground">Processed</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {approvingApplicant && (
        <AlertDialog open={!!approvingApplicant} onOpenChange={() => setApprovingApplicant(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Approve Tutor & Set Rate</AlertDialogTitle>
                <AlertDialogDescription>
                    Set the hourly rate for <span className="font-bold">{approvingApplicant.name}</span>. This will be used for billing students.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-2">
                    <Label htmlFor="tutor-rate">Hourly Rate (₹)</Label>
                    <Input 
                        id="tutor-rate" 
                        type="number" 
                        placeholder="e.g., 5000"
                        value={tutorRate}
                        onChange={(e) => setTutorRate(e.target.value)}
                    />
                </div>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setTutorRate('')}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleApprove}>Confirm Approval</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )}

       {/* A similar card can be created here for managing existing tutors */}
    </div>
  );
}
