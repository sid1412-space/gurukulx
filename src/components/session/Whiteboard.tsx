'use client'

import { Tldraw, useEditor, createShapeId, getSvgAsImage } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useEffect } from 'react'

interface WhiteboardProps {
  questionText?: string | null;
  questionImage?: string | null;
}

const EditorEvents = ({ questionText, questionImage }: WhiteboardProps) => {
	const editor = useEditor();

	useEffect(() => {
		if (!editor) return;
        let isSetupComplete = false;

        const handleMount = async () => {
            if(isSetupComplete) return;

			editor.updateInstanceState({ isFocusMode: true });

            if (questionImage) {
                 try {
                    const response = await fetch(questionImage);
                    const blob = await response.blob();
                    await editor.createAssets([
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
                    const assetId = editor.getAssets()[0].id;
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

                } catch (error) {
                    console.error("Error loading image from data URL:", error);
                    // Fallback to text if image fails
                     editor.createShape({
                        type: 'text',
                        x: 200,
                        y: 200,
                        props: { text: 'Could not load the provided image.' },
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
            isSetupComplete = true;

            editor.zoomToFit();
            editor.centerOnPoint(200, 200)

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
