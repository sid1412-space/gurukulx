
'use client'

import { Tldraw, useEditor } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useEffect, useRef } from 'react'

interface WhiteboardProps {
  questionText?: string | null;
  questionImage?: string | null;
}

const EditorEvents = ({ questionText, questionImage }: WhiteboardProps) => {
	const editor = useEditor();
    const isSetupComplete = useRef(false);

	useEffect(() => {
		if (!editor) return;

		const handleMount = async () => {
			if (isSetupComplete.current) return;

			// Only run setup if there is a question to display
			if (questionImage) {
				try {
					const response = await fetch(questionImage);
					const blob = await response.blob();
					const assetResult = await editor.createAssets([
						{
							type: 'image',
							props: {
								name: 'question.png',
								isAnimated: false,
								mimeType: blob.type,
							},
							file: new File([blob], 'question.png', { type: blob.type }),
						},
					]);
					
					if(assetResult.length > 0) {
						const assetId = assetResult[0].id;
						const { w, h } = await editor.getAssetSize(assetId);

						editor.createShape({
							type: 'image',
							x: 200,
							y: 200,
							props: {
								assetId,
								w,
								h,
							},
						});
					}
				} catch (error) {
					console.error("Error loading image from data URL:", error);
					 editor.createShape({
						type: 'text',
						x: 200,
						y: 200,
						props: { text: 'Could not load the provided image.', size: 'xl' },
					});
				}
			} else if (questionText) {
				editor.createShape({
					type: 'text',
					x: 200,
					y: 200,
					props: { text: questionText, size: 'xl', w: 400 },
				});
			}

            if (questionImage || questionText) {
                editor.zoomToFit();
                editor.centerOnPoint(200, 200);
            }

            editor.updateInstanceState({ isFocusMode: true });
			isSetupComplete.current = true;
		};
		
		editor.on('mount', handleMount);
		
		return () => {
			editor.off('mount', handleMount);
		};

	}, [editor, questionText, questionImage]);

	return null;
}


export default function Whiteboard({ questionText, questionImage }: WhiteboardProps) {
	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw>
                <EditorEvents questionText={questionText} questionImage={questionImage} />
            </Tldraw>
		</div>
	)
}
