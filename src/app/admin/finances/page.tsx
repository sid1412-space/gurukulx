
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

const addFundsSchema = z.object({
  studentEmail: z.string().email(),
  amount: z.coerce.number().positive('Amount must be positive'),
});

export default function FinancialManagementPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof addFundsSchema>>({
    resolver: zodResolver(addFundsSchema),
    defaultValues: { studentEmail: '', amount: 0 },
  });

  function onSubmit(values: z.infer<typeof addFundsSchema>) {
    console.log(values);
    toast({
      title: 'Funds Added',
      description: `$${values.amount} has been added to ${values.studentEmail}'s wallet.`,
    });
    form.reset();
  }

  const handleProcessPayouts = () => {
    toast({
      title: 'Processing Payouts',
      description: 'Pending payouts are being processed.',
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Financial Management</h1>
        <p className="text-muted-foreground">Manage tutor payouts and student wallets.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Add Funds to Student Wallet</CardTitle>
            <CardDescription>Manually add funds to a student's account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
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
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="50.00" {...field} />
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
            <CardTitle>Tutor Payouts</CardTitle>
            <CardDescription>View and manage tutor earnings and process payouts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <h4 className="font-semibold">Pending Payouts</h4>
                <p className="text-2xl font-bold">$12,540.00</p>
             </div>
             <Separator />
             <div>
                <h4 className="font-semibold">Payouts This Month</h4>
                <p className="text-2xl font-bold text-green-600">$45,210.00</p>
             </div>
             <Button className="w-full" onClick={handleProcessPayouts}>Process Pending Payouts</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
