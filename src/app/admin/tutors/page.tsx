
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
import { Banknote, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
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
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';


type Applicant = {
    id: string;
    name: string;
    email: string;
    applicationStatus: 'Pending' | 'Approved' | 'Rejected';
    applicationDetails: {
      expertise: string;
    }
};

type PayoutDetails = {
    accountHolderName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
};

type Tutor = {
  id: string;
  email: string;
  name: string;
  role: 'tutor' | 'banned' | 'student' | 'applicant';
  price?: number;
  applicationDetails?: {
      expertise?: string;
  };
  payoutDetails?: PayoutDetails;
};


export default function TutorManagementPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const { toast } = useToast();
  const isClient = useIsClient();
  const [approvingApplicant, setApprovingApplicant] = useState<Applicant | null>(null);
  const [deletingTutor, setDeletingTutor] = useState<Tutor | null>(null);
  const [viewingTutor, setViewingTutor] = useState<Tutor | null>(null);
  const [tutorRate, setTutorRate] = useState<number | string>('');

  const fetchAllData = async () => {
    if (isClient) {
        // Fetch applicants (users with applicationStatus 'Pending' or 'Rejected')
        const applicantsQuery = query(collection(db, "users"), where("applicationStatus", "in", ["Pending", "Rejected"]));
        const applicantsSnapshot = await getDocs(applicantsQuery);
        const applicantsData = applicantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Applicant));
        setApplicants(applicantsData);

        // Fetch tutors (users with role 'tutor' or 'banned')
        const tutorsQuery = query(collection(db, "users"), where("role", "in", ["tutor", "banned"]));
        const tutorsSnapshot = await getDocs(tutorsQuery);
        const tutorsData = tutorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tutor));
        setTutors(tutorsData);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [isClient]);

  const handleApprove = async () => {
    if (!approvingApplicant || !tutorRate || +tutorRate <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Rate',
        description: 'Please enter a valid positive number for the per-minute rate.',
      });
      return;
    }
    
    const userRef = doc(db, "users", approvingApplicant.id);
    await updateDoc(userRef, {
        role: 'tutor',
        applicationStatus: 'Approved',
        price: +tutorRate
    });

    toast({
      title: `Applicant Approved`,
      description: `${approvingApplicant.name} has been approved with a rate of ₹${tutorRate}/minute.`,
    });

    setApprovingApplicant(null);
    setTutorRate('');
    fetchAllData(); // Refresh all data
  };

  const handleReject = async (id: string, name: string) => {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, { applicationStatus: 'Rejected' });
    toast({
        title: `Applicant Rejected`,
        description: `${name} has been rejected.`,
    });
    fetchAllData();
  };

  const handleReconsider = async (id: string, name: string) => {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, { applicationStatus: 'Pending' });
    toast({
        title: `Applicant Status Reset`,
        description: `${name}'s application is now pending.`,
    });
    fetchAllData();
  };

  const handleViewApplication = (applicantName: string) => {
    toast({
      title: 'Viewing Application',
      description: `Opening application for ${applicantName}. (This is a placeholder action).`,
    });
  };
  
  const handleBan = async (tutorId: string, tutorName: string) => {
    const userRef = doc(db, "users", tutorId);
    await updateDoc(userRef, { role: 'banned' });
    toast({
        variant: 'destructive',
        title: 'Tutor Banned',
        description: `${tutorName} has been banned from the platform.`
    });
    fetchAllData();
  };

  const handleUnban = async (tutorId: string, tutorName: string) => {
    const userRef = doc(db, "users", tutorId);
    await updateDoc(userRef, { role: 'tutor' });
    toast({
        title: 'Tutor Unbanned',
        description: `${tutorName} has been reinstated.`
    });
    fetchAllData();
  };

  const handleDeleteTutor = async () => {
    if (!deletingTutor) return;
    
    await deleteDoc(doc(db, "users", deletingTutor.id));
    
    toast({
        variant: 'destructive',
        title: 'Tutor Deleted',
        description: `${deletingTutor.name} has been permanently removed from the system.`
    });
    
    setDeletingTutor(null);
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
                  <TableCell>{applicant.applicationDetails?.expertise || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={getApplicantBadgeVariant(applicant.applicationStatus)}>
                      {applicant.applicationStatus}
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
                        
                        {applicant.applicationStatus !== 'Approved' && (
                           <DropdownMenuItem
                            className="text-green-600 focus:text-green-600"
                            onClick={() => setApprovingApplicant(applicant)}
                           >
                            Approve
                           </DropdownMenuItem>
                        )}

                        {applicant.applicationStatus === 'Pending' ? (
                           <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleReject(applicant.id, applicant.name)}
                            >
                              Reject
                            </DropdownMenuItem>
                        ) : (
                           <DropdownMenuItem
                              onClick={() => handleReconsider(applicant.id, applicant.name)}
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
                            <TableCell>{tutor.applicationDetails?.expertise || 'N/A'}</TableCell>
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
                                        <DropdownMenuItem onClick={() => setViewingTutor(tutor)}>
                                            <Banknote className="mr-2 h-4 w-4"/>
                                            View Payout Details
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator/>
                                        {tutor.role === 'banned' ? (
                                            <>
                                                <DropdownMenuItem onClick={() => handleUnban(tutor.id, tutor.name)}>
                                                    Unban Tutor
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => setDeletingTutor(tutor)}>
                                                    Delete Tutor
                                                </DropdownMenuItem>
                                            </>
                                        ) : (
                                            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleBan(tutor.id, tutor.name)}>
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

      {deletingTutor && (
        <AlertDialog open={!!deletingTutor} onOpenChange={() => setDeletingTutor(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the tutor account for <span className="font-bold">{deletingTutor.name}</span> and remove all of their data from the servers.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteTutor} className="bg-destructive hover:bg-destructive/90">
                    Yes, delete tutor
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )}
      
      {viewingTutor && (
        <AlertDialog open={!!viewingTutor} onOpenChange={() => setViewingTutor(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Payout Details for {viewingTutor.name}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bank account information for processing payouts.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {viewingTutor.payoutDetails ? (
                    <div className="text-sm space-y-2">
                        <p><span className="font-semibold">Account Holder:</span> {viewingTutor.payoutDetails.accountHolderName || 'N/A'}</p>
                        <p><span className="font-semibold">Account Number:</span> {viewingTutor.payoutDetails.accountNumber || 'N/A'}</p>
                        <p><span className="font-semibold">IFSC Code:</span> {viewingTutor.payoutDetails.ifscCode || 'N/A'}</p>
                        <p><span className="font-semibold">UPI ID:</span> {viewingTutor.payoutDetails.upiId || 'N/A'}</p>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">This tutor has not submitted their payout details yet.</p>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )}

    </div>
  );
}

    