
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ShieldCheck } from 'lucide-react';
import Logo from '../Logo';

interface LobbyProps {
  onAgree: () => void;
}

export default function Lobby({ onAgree }: LobbyProps) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/30">
      <Card className="w-full max-w-lg shadow-lg animate-fade-in">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
               <Logo />
            </div>
          <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
            <ShieldCheck className="h-8 w-8 text-primary" />
            Session Security & Guidelines
          </CardTitle>
          <CardDescription>Please read and agree to the following before you proceed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted/50 border border-dashed rounded-lg space-y-2 text-sm text-muted-foreground">
            <p className="font-bold">This session may be monitored by our team for quality and safety purposes.</p>
            <ul className="list-disc list-inside space-y-1">
                <li><span className="font-semibold">Do not</span> share any personal contact information (e.g., phone number, email address, social media).</li>
                <li><span className="font-semibold">Do not</span> engage in any inappropriate or abusive behavior.</li>
                <li>All communication should happen on the GurukulX platform.</li>
            </ul>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" checked={isChecked} onCheckedChange={(checked) => setIsChecked(checked as boolean)} />
            <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              I have read and agree to the session guidelines.
            </Label>
          </div>
          <Button
            className="w-full"
            disabled={!isChecked}
            onClick={onAgree}
            size="lg"
          >
            Proceed to Session
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
