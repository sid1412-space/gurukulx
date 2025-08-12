
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

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof securitySchema>>({
    resolver: zodResolver(securitySchema),
    defaultValues: { adminEmail: 'quotesparkconnect@yahoo.com' },
  });

  function onSubmit(values: z.infer<typeof securitySchema>) {
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
        <p className="text-muted-foreground">Manage global settings for the TutorConnect platform.</p>
      </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield /> Security</CardTitle>
                <CardDescription>Manage administrator access and security settings.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
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
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <FormLabel>Enable Stripe</FormLabel>
                        <Switch defaultChecked disabled />
                    </div>
                    <div className="flex items-center justify-between">
                        <FormLabel>Enable Manual UPI</FormLabel>
                        <Switch defaultChecked onCheckedChange={(checked) => handleToggle('Manual UPI', checked)}/>
                    </div>
                     <Button variant="outline" className="w-full">Configure Gateways</Button>
                </CardContent>
                </Card>
            
                <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Percent /> Platform Fees</CardTitle>
                    <CardDescription>Set the commission rate for tutor sessions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input type="number" defaultValue="15" />
                    <Button className="w-full">Save Commission</Button>
                </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
