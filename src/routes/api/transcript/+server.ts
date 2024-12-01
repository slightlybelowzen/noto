import { OpenAI } from 'openai';
import type { RequestHandler } from './$types';

const openai = new OpenAI({
	apiKey: ""
});

export const POST: RequestHandler = async ({ request }) => {
	const { audioData } = await request.json();
	try {
		const base64Data = audioData.split(',')[1];
		const binaryData = Buffer.from(base64Data, 'base64');
		
        const audioFile = new File([binaryData], 'audio.wav', { type: 'audio/wav' });
		console.log('Sending file to OpenAI:', audioFile.size, audioFile.type);
        
		const transcript = await openai.audio.transcriptions.create({
			model: 'whisper-1',
			file: audioFile,
			response_format: 'text',
		});

		return new Response(JSON.stringify({ transcript }), {
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		console.error('Error transcribing audio:', error);
		return new Response(JSON.stringify({ 
			error: error instanceof Error ? error.message : 'Failed to transcribe audio',
			details: error 
		}), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
};
