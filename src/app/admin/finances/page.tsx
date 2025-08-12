
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState, useEffect } from 'react';
import { useIsClient } from '@/hooks/use-is-client';

const addFundsSchema = z.object({
  studentEmail: z.string().email(),
  amount: z.coerce.number().positive('Amount must be positive'),
});

const updateEarningsSchema = z.object({
  tutorEmail: z.string().email(),
  earnings: z.coerce.number().positive('Earnings must be positive'),
});

type RechargeRequest = {
  id: string;
  studentEmail: string;
  amount: number;
  status: 'pending';
};


export default function FinancialManagementPage() {
  const { toast } = useToast();
  const isClient = useIsClient();
  const [rechargeRequests, setRechargeRequests] = useState<RechargeRequest[]>([]);

  useEffect(() => {
    if(isClient) {
      const storedRequests = localStorage.getItem('rechargeRequests') || '[]';
      setRechargeRequests(JSON.parse(storedRequests));
    }
  }, [isClient]);

  const addFundsForm = useForm<z.infer<typeof addFundsSchema>>({
    resolver: zodResolver(addFundsSchema),
    defaultValues: { studentEmail: '', amount: 0 },
  });
  
  const updateEarningsForm = useForm<z.infer<typeof updateEarningsSchema>>({
    resolver: zodResolver(updateEarningsSchema),
    defaultValues: { tutorEmail: '', earnings: 0 },
  });


  function onAddFunds(values: z.infer<typeof addFundsSchema>) {
    console.log(values);
    toast({
      title: 'Funds Added',
      description: `₹${values.amount} has been added to ${values.studentEmail}'s wallet.`,
    });
    addFundsForm.reset();
  }
  
  function onUpdateEarnings(values: z.infer<typeof updateEarningsSchema>) {
    console.log(values);
    toast({
      title: 'Earnings Updated',
      description: `Today's earnings for ${values.tutorEmail} updated to ₹${values.earnings}.`,
    });
    updateEarningsForm.reset();
  }

  const handleProcessPayouts = () => {
    toast({
      title: 'Processing Payouts',
      description: 'Pending payouts are being processed.',
    });
  };
  
  const updateRechargeRequests = (updatedRequests: RechargeRequest[]) => {
      setRechargeRequests(updatedRequests);
      localStorage.setItem('rechargeRequests', JSON.stringify(updatedRequests));
      window.dispatchEvent(new Event('storage'));
  };

  const handleApproveRecharge = (requestId: string) => {
    const request = rechargeRequests.find(r => r.id === requestId);
    if (!request) return;

    // In a real app, you'd add this to the student's actual balance.
    const updatedRequests = rechargeRequests.filter(r => r.id !== requestId);
    updateRechargeRequests(updatedRequests);
    toast({
        title: 'Recharge Approved',
        description: `₹${request.amount} has been added to ${request.studentEmail}'s wallet.`
    });
  };
  
  const handleRejectRecharge = (requestId: string) => {
      const request = rechargeRequests.find(r => r.id === requestId);
      if (!request) return;

      const updatedRequests = rechargeRequests.filter(r => r.id !== requestId);
      updateRechargeRequests(updatedRequests);
      toast({
          variant: 'destructive',
          title: 'Recharge Rejected',
          description: `The recharge request for ${request.studentEmail} has been rejected.`
      });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Financial Management</h1>
        <p className="text-muted-foreground">Manage tutor payouts and student wallets.</p>
      </header>
      
      <Card>
          <CardHeader>
              <CardTitle>Pending Wallet Recharges</CardTitle>
              <CardDescription>Review and approve manual recharge requests from students.</CardDescription>
          </CardHeader>
          <CardContent>
              <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student Email</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isClient && rechargeRequests.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                                No pending recharge requests.
                            </TableCell>
                        </TableRow>
                    )}
                    {rechargeRequests.map(request => (
                        <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.studentEmail}</TableCell>
                            <TableCell>₹{request.amount.toFixed(2)}</TableCell>
                            <TableCell className="text-right space-x-2">
                                 <Button size="sm" onClick={() => handleApproveRecharge(request.id)}>Approve</Button>
                                 <Button size="sm" variant="destructive" onClick={() => handleRejectRecharge(request.id)}>Reject</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
              </Table>
          </CardContent>
      </Card>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Add Funds to Student Wallet</CardTitle>
                <CardDescription>Manually add funds to a student's account.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...addFundsForm}>
                  <form onSubmit={addFundsForm.handleSubmit(onAddFunds)} className="space-y-6">
                    <FormField
                      control={addFundsForm.control}
                      name="studentEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="student@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addFundsForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="5000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Add Funds</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
             <Card>
              <CardHeader>
                <CardTitle>Update Tutor Daily Earnings</CardTitle>
                <CardDescription>Manually set the earnings for a tutor for today.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...updateEarningsForm}>
                  <form onSubmit={updateEarningsForm.handleSubmit(onUpdateEarnings)} className="space-y-6">
                    <FormField
                      control={updateEarningsForm.control}
                      name="tutorEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tutor Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="tutor@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={updateEarningsForm.control}
                      name="earnings"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Today's Earnings (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="12500" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Update Earnings</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
        </div>


        <Card>
          <CardHeader>
            <CardTitle>Tutor Payouts</CardTitle>
            <CardDescription>View and manage tutor earnings and process payouts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <h4 className="font-semibold">Pending Payouts</h4>
                <p className="text-2xl font-bold">₹12,540.00</p>
             </div>
             <Separator />
             <div>
                <h4 className="font-semibold">Payouts This Month</h4>
                <p className="text-2xl font-bold text-green-600">₹45,210.00</p>
             </div>
             <Button className="w-full" onClick={handleProcessPayouts}>Process Pending Payouts</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
