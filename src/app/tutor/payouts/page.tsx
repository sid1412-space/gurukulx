
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
import { Banknote, Wallet, Calendar, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useIsClient } from '@/hooks/use-is-client';


type Payout = {
    id: string;
    date: string;
    amount: number;
    status: 'Pending' | 'Paid';
};

const MOCK_PAYOUTS: Payout[] = [
    { id: 'pay_1', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), amount: 8500, status: 'Paid'},
    { id: 'pay_2', date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), amount: 7200, status: 'Paid'}
];

export default function PayoutsPage() {
    const { toast } = useToast();
    const isClient = useIsClient();
    const [tutorData, setTutorData] = useState({ totalEarnings: 15700, pendingEarnings: 1250 });
    const [payoutHistory, setPayoutHistory] = useState<Payout[]>([]);

    useEffect(() => {
        if (isClient) {
            setPayoutHistory(MOCK_PAYOUTS);
        }
    }, [isClient]);

    const handleRequestPayout = () => {
        if (tutorData.pendingEarnings <= 0) {
            toast({
                variant: 'destructive',
                title: 'No Pending Earnings',
                description: 'You do not have any earnings to withdraw.'
            });
            return;
        }

        const payoutRequests = JSON.parse(localStorage.getItem('payoutRequests') || '[]');
        const newRequest = {
            id: `payoutreq_${Math.random().toString(36).substring(2, 9)}`,
            tutorEmail: localStorage.getItem('loggedInUser'),
            amount: tutorData.pendingEarnings,
            status: 'pending',
            date: new Date().toISOString()
        };
        payoutRequests.push(newRequest);
        localStorage.setItem('payoutRequests', JSON.stringify(payoutRequests));

        toast({
            title: 'Payout Requested',
            description: 'Your request has been submitted and the admin has been notified.'
        });
    }

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
            <Banknote className="h-8 w-8 text-primary" />
            Payouts
        </h1>
        <p className="text-muted-foreground">Track your earnings and manage your payouts.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">₹{tutorData.totalEarnings.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">All time earnings</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">₹{tutorData.pendingEarnings.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Earnings this cycle</p>
            </CardContent>
        </Card>
         <Card className="bg-primary/10 flex flex-col items-center justify-center">
            <CardContent className="py-6 text-center">
                 <h3 className="text-lg font-semibold">Ready to get paid?</h3>
                <p className="text-sm text-muted-foreground mb-4">Request your pending balance now.</p>
                <Button onClick={handleRequestPayout} disabled={tutorData.pendingEarnings <= 0}>Request Payout</Button>
            </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>A complete log of all your past payouts.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Payout ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Invoice</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {payoutHistory.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                                You have no payout history.
                            </TableCell>
                        </TableRow>
                    ) : (
                        payoutHistory.map((payout) => (
                        <TableRow key={payout.id}>
                            <TableCell className="font-mono text-xs">{payout.id}</TableCell>
                            <TableCell>{format(new Date(payout.date), 'PPP')}</TableCell>
                            <TableCell className="font-medium">₹{payout.amount.toFixed(2)}</TableCell>
                            <TableCell>
                                <Badge variant={payout.status === 'Paid' ? 'default' : 'outline'}>
                                    {payout.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                            </Button>
                            </TableCell>
                        </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
          </CardContent>
      </Card>
      
    </div>
  );
}
