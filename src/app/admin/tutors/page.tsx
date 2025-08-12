
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

type Tutor = {
  email: string;
  name: string;
  role: 'tutor' | 'banned';
  price?: number;
  subject?: string;
};


export default function TutorManagementPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const { toast } = useToast();
  const isClient = useIsClient();
  const [approvingApplicant, setApprovingApplicant] = useState<Applicant | null>(null);
  const [tutorRate, setTutorRate] = useState<number | string>('');

  const fetchAllData = () => {
        if (isClient) {
            // Fetch Applicants
            const storedApplicants = localStorage.getItem('tutorApplicants') || '[]';
            try {
                const allApplicants = JSON.parse(storedApplicants);
                // Filter out already approved applicants so they don't clutter the main view
                setApplicants(allApplicants.filter((app: Applicant) => app.status !== 'Approved'));
            } catch (error) {
                console.error("Failed to parse tutor applicants from localStorage", error);
                setApplicants([]);
            }

            // Fetch Tutors (approved and banned)
            const usersJSON = localStorage.getItem('userDatabase') || '[]';
            try {
                 const allUsers = JSON.parse(usersJSON);
                 const approvedTutors = allUsers.filter((user: any) => user.role === 'tutor' || user.role === 'banned');
                 // Enrich tutor data with their subject from the application list
                 const enrichedTutors = approvedTutors.map((tutor:Tutor) => {
                    const applicantData = JSON.parse(storedApplicants).find((a:any) => a.email === tutor.email);
                    return {...tutor, subject: applicantData?.subject || 'N/A' };
                 });

                 setTutors(enrichedTutors);
            } catch(error) {
                console.error("Failed to parse user database", error);
                setTutors([]);
            }
        }
    };


  useEffect(() => {
    fetchAllData();
    window.addEventListener('storage', fetchAllData);
    return () => {
        window.removeEventListener('storage', fetchAllData);
    };
  }, [isClient]);

  const updateLocalStorageApplicants = (updatedApplicants: Applicant[]) => {
    if(isClient) {
        // When updating, we need to merge with any already approved applicants
        const storedApplicants = localStorage.getItem('tutorApplicants') || '[]';
        const allApplicants = JSON.parse(storedApplicants);
        const approvedApplicants = allApplicants.filter((app: Applicant) => app.status === 'Approved');

        const currentApplicants = updatedApplicants.filter(app => app.status !== 'Approved');

        localStorage.setItem('tutorApplicants', JSON.stringify([...approvedApplicants, ...currentApplicants]));
        window.dispatchEvent(new Event('storage'));
    }
  };


  const handleApprove = () => {
    if (!approvingApplicant || !tutorRate || +tutorRate <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Rate',
        description: 'Please enter a valid positive number for the per-minute rate.',
      });
      return;
    }

    const updatedApplicants = applicants.map(applicant =>
      applicant.id === approvingApplicant.id ? { ...applicant, status: 'Approved' } : applicant
    );
    setApplicants(updatedApplicants.filter(app => app.status !== 'Approved')); // Remove from view
    updateLocalStorageApplicants(updatedApplicants);

    try {
      const usersJSON = localStorage.getItem('userDatabase') || '[]';
      const users = JSON.parse(usersJSON);

      // Update the user's role from 'student' to 'tutor' and set their price
      const updatedUsers = users.map((u:any) => u.email === approvingApplicant.email ? {...u, role: 'tutor', price: +tutorRate} : u);
      localStorage.setItem('userDatabase', JSON.stringify(updatedUsers));
      
    } catch (error) {
      console.error('Failed to update user database:', error);
      toast({
        variant: 'destructive',
        title: 'Error Approving Applicant',
        description: `Could not add ${approvingApplicant.name} to the user list.`,
      });
      // Revert local state on error
       const revertedApplicants = applicants.map(applicant =>
            applicant.id === approvingApplicant.id ? { ...applicant, status: 'Pending' } : applicant
        );
       setApplicants(revertedApplicants);
       updateLocalStorageApplicants(revertedApplicants);
      return;
    }

    toast({
      title: `Applicant Approved`,
      description: `${approvingApplicant.name} has been approved with a rate of ₹${tutorRate}/minute.`,
    });

    setApprovingApplicant(null);
    setTutorRate('');
    fetchAllData(); // Refresh all data
  };

  const handleReject = (id: string) => {
    const applicantToUpdate = applicants.find(applicant => applicant.id === id);
    if (!applicantToUpdate) return;

    const updatedApplicants = applicants.map(applicant =>
      applicant.id === id ? { ...applicant, status: 'Rejected' } : applicant
    );
    setApplicants(updatedApplicants);
    updateLocalStorageApplicants(updatedApplicants);

     toast({
      title: `Applicant Rejected`,
      description: `${applicantToUpdate.name} has been rejected.`,
    });
  };

  const handleReconsider = (id: string) => {
    const applicantToUpdate = applicants.find(applicant => applicant.id === id);
    if (!applicantToUpdate) return;

    const updatedApplicants = applicants.map(applicant =>
      applicant.id === id ? { ...applicant, status: 'Pending' } : applicant
    );
    setApplicants(updatedApplicants);
    updateLocalStorageApplicants(updatedApplicants);

     toast({
      title: `Applicant Status Reset`,
      description: `${applicantToUpdate.name}'s application is now pending.`,
    });
  };

  const handleViewApplication = (applicantName: string) => {
    toast({
      title: 'Viewing Application',
      description: `Opening application for ${applicantName}. (This is a placeholder action).`,
    });
  };
  
   const handleBan = (tutorEmail: string, tutorName: string) => {
    const usersJSON = localStorage.getItem('userDatabase') || '[]';
    const users = JSON.parse(usersJSON);
    const updatedUsers = users.map((u:any) => u.email === tutorEmail ? {...u, role: 'banned'} : u);
    localStorage.setItem('userDatabase', JSON.stringify(updatedUsers));
    window.dispatchEvent(new Event('storage'));
    toast({
        variant: 'destructive',
        title: 'Tutor Banned',
        description: `${tutorName} has been banned from the platform.`
    });
    fetchAllData();
  };

  const handleUnban = (tutorEmail: string, tutorName: string) => {
    const usersJSON = localStorage.getItem('userDatabase') || '[]';
    const users = JSON.parse(usersJSON);
    const updatedUsers = users.map((u:any) => u.email === tutorEmail ? {...u, role: 'tutor'} : u);
    localStorage.setItem('userDatabase', JSON.stringify(updatedUsers));
    window.dispatchEvent(new Event('storage'));
    toast({
        title: 'Tutor Unbanned',
        description: `${tutorName} has been reinstated.`
    });
    fetchAllData();
  };


  const getApplicantBadgeVariant = (status: 'Pending' | 'Approved' | 'Rejected') => {
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
                <TableRow key={applicant.id}>
                  <TableCell className="font-medium">{applicant.name}</TableCell>
                  <TableCell>{applicant.email}</TableCell>
                  <TableCell>{applicant.subject}</TableCell>
                  <TableCell>
                    <Badge variant={getApplicantBadgeVariant(applicant.status)}>
                      {applicant.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
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
                        
                        {applicant.status !== 'Approved' && (
                           <DropdownMenuItem
                            className="text-green-600 focus:text-green-600"
                            onClick={() => setApprovingApplicant(applicant)}
                           >
                            Approve
                           </DropdownMenuItem>
                        )}

                        {applicant.status === 'Pending' ? (
                           <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleReject(applicant.id)}
                            >
                              Reject
                            </DropdownMenuItem>
                        ) : (
                           <DropdownMenuItem
                              onClick={() => handleReconsider(applicant.id)}
                            >
                              Reconsider
                            </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {isClient && applicants.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
                <p>No new tutor applications at this time.</p>
            </div>
           )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Active Tutors</CardTitle>
            <CardDescription>Manage all approved tutors on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Primary Subject</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tutors.map((tutor) => (
                        <TableRow key={tutor.email}>
                            <TableCell className="font-medium">{tutor.name}</TableCell>
                            <TableCell>{tutor.email}</TableCell>
                            <TableCell>{tutor.subject}</TableCell>
                            <TableCell>₹{tutor.price || 'N/A'}/min</TableCell>
                            <TableCell>
                                <Badge variant={tutor.role === 'banned' ? 'destructive' : 'default'}>
                                    {tutor.role === 'banned' ? 'Banned' : 'Active'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Moderation</DropdownMenuLabel>
                                        {tutor.role === 'banned' ? (
                                             <DropdownMenuItem onClick={() => handleUnban(tutor.email, tutor.name)}>
                                                Unban Tutor
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleBan(tutor.email, tutor.name)}>
                                                Ban Tutor
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {isClient && tutors.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                    <p>No active tutors on the platform yet.</p>
                </div>
            )}
        </CardContent>
      </Card>


      {approvingApplicant && (
        <AlertDialog open={!!approvingApplicant} onOpenChange={() => setApprovingApplicant(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Approve Tutor & Set Rate</AlertDialogTitle>
                <AlertDialogDescription>
                    Set the per-minute rate for <span className="font-bold">{approvingApplicant.name}</span>. This will be used for billing students.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-2">
                    <Label htmlFor="tutor-rate">Rate per minute (₹)</Label>
                    <Input
                        id="tutor-rate"
                        type="number"
                        placeholder="e.g., 80"
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

    </div>
  );
}
