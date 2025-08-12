
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
import { Button } from '@/components/ui/button';
import { Users, Wallet } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { initializeMockData } from '@/lib/mock-data';


type Student = {
  id: string;
  email: string;
  name: string;
  walletBalance: number;
};

export default function StudentManagementPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const { toast } = useToast();
  const isClient = useIsClient();
  const [managingStudent, setManagingStudent] = useState<Student | null>(null);
  const [walletAmount, setWalletAmount] = useState<number | string>('');

  const fetchAllData = () => {
    if (isClient) {
      initializeMockData();
      const allUsers = JSON.parse(localStorage.getItem('userDatabase') || '[]');
      setStudents(allUsers.filter((u: any) => u.role === 'student'));
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [isClient]);

  const handleUpdateBalance = () => {
    if (!managingStudent || walletAmount === '') {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Please enter a valid number for the wallet balance.',
      });
      return;
    }

    const newBalance = parseFloat(walletAmount as string);
    const users = JSON.parse(localStorage.getItem('userDatabase') || '[]');
    const studentIndex = users.findIndex((u: any) => u.id === managingStudent.id);

    if (studentIndex !== -1) {
      users[studentIndex].walletBalance = newBalance;
      localStorage.setItem('userDatabase', JSON.stringify(users));
      
      toast({
        title: 'Wallet Updated',
        description: `${managingStudent.name}'s wallet balance has been updated to ₹${newBalance.toFixed(2)}.`,
      });

      setManagingStudent(null);
      setWalletAmount('');
      fetchAllData();
    } else {
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: 'Could not find the student to update.',
        });
    }
  };
  
  const handleOpenWalletManager = (student: Student) => {
    setManagingStudent(student);
    setWalletAmount(student.walletBalance);
  };


  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
            <Users className="h-8 w-8 text-primary"/>
            Student Management
        </h1>
        <p className="text-muted-foreground">View and manage all student accounts on the platform.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>A list of all registered students.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Wallet Balance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isClient && students.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No students found.
                    </TableCell>
                </TableRow>
              )}
              {students.map((student) => (
                <TableRow key={student.email}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>₹{student.walletBalance.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleOpenWalletManager(student)}>
                        <Wallet className="mr-2 h-4 w-4"/>
                        Manage Wallet
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {managingStudent && (
        <AlertDialog open={!!managingStudent} onOpenChange={() => setManagingStudent(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Manage Wallet for {managingStudent.name}</AlertDialogTitle>
                <AlertDialogDescription>
                    Set a new wallet balance for this student. This will overwrite their current balance.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-2">
                    <Label htmlFor="wallet-balance">New Balance (₹)</Label>
                    <Input
                        id="wallet-balance"
                        type="number"
                        placeholder="e.g., 500.00"
                        value={walletAmount}
                        onChange={(e) => setWalletAmount(e.target.value)}
                    />
                </div>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setWalletAmount('')}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleUpdateBalance}>Set Balance</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )}

    </div>
  );
}
