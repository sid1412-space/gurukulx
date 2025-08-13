
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Loader2, Shield, Percent, CreditCard } from 'lucide-react';

const securitySchema = z.object({
  adminEmail: z.string().email(),
});

const paymentSchema = z.object({}); // Empty schema for the payment form wrapper
const feeSchema = z.object({
    commission: z.coerce.number().min(0).max(100),
});


export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const securityForm = useForm<z.infer<typeof securitySchema>>({
    resolver: zodResolver(securitySchema),
    defaultValues: { adminEmail: 'gurukulxconnect@yahoo.com' },
  });

  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    defaultValues: {},
  });
  
  const feeForm = useForm<z.infer<typeof feeSchema>>({
    resolver: zodResolver(feeSchema),
    defaultValues: { commission: 15 },
  });


  function onSecuritySubmit(values: z.infer<typeof securitySchema>) {
    setIsLoading(true);
    console.log(values);
    setTimeout(() => {
      toast({
        title: 'Settings Updated',
        description: 'Your administrative settings have been saved.',
      });
      setIsLoading(false);
    }, 1000);
  }
  
   function onFeeSubmit(values: z.infer<typeof feeSchema>) {
    console.log(values);
    toast({
      title: 'Commission Rate Updated',
      description: `The new platform fee is ${values.commission}%.`,
    });
  }

   const handleToggle = (feature: string, enabled: boolean) => {
    toast({
        title: `${feature} ${enabled ? 'Enabled' : 'Disabled'}`,
        description: `Platform setting has been updated.`
    });
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Platform Settings</h1>
        <p className="text-muted-foreground">Manage global settings for the GurukulX platform.</p>
      </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield /> Security</CardTitle>
                <CardDescription>Manage administrator access and security settings.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                    <FormField
                    control={securityForm.control}
                    name="adminEmail"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Administrator Email</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="admin@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <FormLabel>Enable Two-Factor Authentication</FormLabel>
                             <p className="text-xs text-muted-foreground">
                                Secure admin login with an additional code.
                            </p>
                        </div>
                        <Switch onCheckedChange={(checked) => handleToggle('Two-Factor Authentication', checked)}/>
                    </div>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Security Settings
                    </Button>
                </form>
                </Form>
            </CardContent>
            </Card>

            <div className="space-y-8">
                <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CreditCard /> Payment Gateway</CardTitle>
                    <CardDescription>Manage payment provider integrations.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...paymentForm}>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <FormLabel>Enable Stripe</FormLabel>
                            <Switch defaultChecked disabled />
                        </div>
                        <div className="flex items-center justify-between">
                            <FormLabel>Enable Manual UPI</FormLabel>
                            <Switch defaultChecked onCheckedChange={(checked) => handleToggle('Manual UPI', checked)}/>
                        </div>
                        <Button variant="outline" className="w-full">Configure Gateways</Button>
                      </div>
                  </Form>
                </CardContent>
                </Card>
            
                <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Percent /> Platform Fees</CardTitle>
                    <CardDescription>Set the commission rate for tutor sessions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...feeForm}>
                        <form onSubmit={feeForm.handleSubmit(onFeeSubmit)} className="space-y-4">
                             <FormField
                                control={feeForm.control}
                                name="commission"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <Button type="submit" className="w-full">Save Commission</Button>
                        </form>
                    </Form>
                </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
