
'use client'

import { Tldraw, useEditor } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useEffect, useRef } from 'react'
import JitsiMeetComponent from './JitsiMeetComponent'

const EditorEvents = () => {
	const editor = useEditor();
    const isSetupComplete = useRef(false);

	useEffect(() => {
		if (!editor) return;

		// See `src/app/session/[sessionId]/page.tsx` for how we use this event.
		const handleCreateShapesEvent = (event: CustomEvent<{ shapes: any[] }>) => {
			if (event.detail.shapes) {
				editor.createShapes(event.detail.shapes);
                editor.zoomToFit();
			}
		};
		
		window.addEventListener('create-shapes', handleCreateShapesEvent as EventListener);


		const handleMount = async () => {
			if (isSetupComplete.current) return;
            isSetupComplete.current = true;

            const promptText = `
Welcome to your session!

To get started, upload an image of your question.

Use the image tool in the toolbar (7th icon from the top).
            `;

            editor.createShape({
                type: 'text',
                x: 200,
                y: 200,
                props: { text: promptText, size: 'xl', w: 500, align: 'middle' },
            });
            
            editor.zoomToFit();
            editor.centerOnPoint(200, 200);

		};
		
		editor.on('mount', handleMount);
		
		return () => {
			editor.off('mount', handleMount);
			window.removeEventListener('create-shapes', handleCreateShapesEvent as EventListener);
		};

	}, [editor]);

	return null;
}

export default function Whiteboard({ children }: { children?: React.ReactNode }) {
	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw persistenceKey="gurukulx-whiteboard-stable">
                {children}
                <EditorEvents />
			</Tldraw>
		</div>
	)
}
