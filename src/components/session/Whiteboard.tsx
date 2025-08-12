
'use client'

import { Tldraw, TldrawUi, useEditor } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useEffect, useRef, type ReactNode } from 'react'

const EditorEvents = () => {
	const editor = useEditor();
    const isSetupComplete = useRef(false);

	useEffect(() => {
		if (!editor) return;

		// See `src/app/session/[sessionId]/page.tsx` for how we use this event.
		const handleCreateShapesEvent = (event: CustomEvent<{ shapes: any[] }>) => {
			if (event.detail.shapes) {
				editor.createShapes(event.detail.shapes);
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

type WhiteboardProps = {
    children?: ReactNode;
}

export default function Whiteboard({ children }: WhiteboardProps) {
	return (
		<div style={{ position: 'relative', width: '100%', height: '100%' }}>
			<Tldraw persistenceKey="tutorconnect-whiteboard">
                <TldrawUi.Canvas>
                     {children}
                </TldrawUi.Canvas>
                <EditorEvents />
            </Tldraw>
		</div>
	)
}
