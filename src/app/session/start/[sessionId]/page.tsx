
'use client';

import { useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image as ImageIcon, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SessionStartPage() {
  const router = useRouter();
  const params = useParams();
  const { sessionId } = params;
  const { toast } = useToast();

  const [questionText, setQuestionText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please select an image file.',
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleStartSession = () => {
    setIsLoading(true);

    const navigateToSession = (params: URLSearchParams) => {
      router.push(`/session/${sessionId}?${params.toString()}`);
    };

    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        try {
          sessionStorage.setItem('questionImage', reader.result as string);
          navigateToSession(new URLSearchParams());
        } catch (error) {
           toast({
            variant: 'destructive',
            title: 'Could not store image',
            description: 'The image you selected is too large. Please select a smaller one.',
          });
          setIsLoading(false);
        }
      };
      reader.onerror = () => {
        toast({
          variant: 'destructive',
          title: 'Error Reading File',
          description: 'Could not read the selected image.',
        });
        setIsLoading(false);
      };
    } else if (questionText.trim()) {
      const params = new URLSearchParams();
      params.set('questionText', questionText);
      navigateToSession(params);
    } else {
      router.push(`/session/${sessionId}`);
    }
  };
  
  const handleSkip = () => {
    router.push(`/session/${sessionId}`);
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-lg animate-fade-in">
        <CardHeader>
          <CardTitle>Prepare for Your Session</CardTitle>
          <CardDescription>
            Upload a photo of your question or type it out. This will be added to the whiteboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">
                <FileText className="mr-2" />
                Type Question
              </TabsTrigger>
              <TabsTrigger value="image">
                <ImageIcon className="mr-2" />
                Upload Image
              </TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="mt-4">
              <Label htmlFor="question-text">Your Question</Label>
              <Textarea
                id="question-text"
                placeholder="e.g., How do I solve for x in the equation 2x + 5 = 15?"
                rows={5}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                disabled={!!selectedFile}
              />
            </TabsContent>
            <TabsContent value="image" className="mt-4">
              <Label htmlFor="question-image">Question Image</Label>
              <Input
                id="question-image"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                disabled={!!questionText.trim()}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={!!questionText.trim()}
              >
                {selectedFile ? 'Change Image' : 'Select an Image'}
              </Button>
              {selectedFile && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Selected: {selectedFile.name}
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row gap-2">
          <Button onClick={handleStartSession} className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Start Session with Question
          </Button>
          <Button onClick={handleSkip} variant="ghost" className="w-full sm:w-auto mt-2 sm:mt-0">Skip</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
