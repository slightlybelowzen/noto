<script lang="ts">
	import { onDestroy, createEventDispatcher } from 'svelte';
	import Mic from 'lucide-svelte/icons/mic';
	import { Button } from '$lib/components/ui/button/index.js';

	let mediaRecorder: MediaRecorder | null = null;
	let audioChunks: Blob[] = $state([]);
	let isRecording = $state(false);
	let audioUrl: string = $state('');
    let transcription: string = $state('');
	const dispatch = createEventDispatcher();

	async function startRecording() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: {
					echoCancellation: true,
					noiseSuppression: true
				}
			});
			
			mediaRecorder = new MediaRecorder(stream);

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunks.push(event.data);
				}
			};

			mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
				audioUrl = URL.createObjectURL(audioBlob);
				audioChunks = [];

				try {
					const reader = new FileReader();
					const base64Promise = new Promise((resolve) => {
						reader.onloadend = () => resolve(reader.result);
					});
					reader.readAsDataURL(audioBlob);
					const base64Audio = await base64Promise;

					const response = await fetch("/api/transcript", {
						method: "POST",
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ audioData: base64Audio }),
					});
					const data = await response.json();
					console.log('Transcript response:', data);
					transcription = data.transcript;
					
					// Process the transcript to update markdown
					processTranscript(transcription);
				} catch (error) {
					console.error('Failed to get transcript:', error);
				}
			};

			mediaRecorder.start(200);
			isRecording = true;
		} catch (error) {
			console.error('Error accessing microphone:', error);
		}
	}

	function stopRecording() {
		if (mediaRecorder && isRecording) {
			mediaRecorder.stop();
			isRecording = false;

			// Stop all tracks in the stream
			mediaRecorder.stream.getTracks().forEach((track) => track.stop());
		}
	}

	function toggleRecording() {
		if (isRecording) {
			stopRecording();
		} else {
			startRecording();
		}
	}

	// Cleanup
	onDestroy(() => {
		if (audioUrl) {
			URL.revokeObjectURL(audioUrl);
		}
	});

	function processTranscript(transcript: string) {
		// Convert transcript to lowercase for easier matching
		const text = transcript.toLowerCase();
		
		if (text.includes('cross') && (text.includes('to-do') || text.includes('todos'))) {
			// Dispatch event to parent component
			dispatch('transcriptCommand', {
				type: 'crossTodos',
				transcript: text
			});
		}
	}
</script>

<Button
	variant="outline"
	class={isRecording
		? 'bg-red-600 text-white hover:bg-red-600/90 hover:text-white'
		: 'bg-gray-200 hover:bg-gray-300'}
	onclick={toggleRecording}
>
	{isRecording ? 'Stop Recording' : 'Start Recording'}
	<Mic class="-ml-1" />
</Button>

{#if transcription}
    <p class="text-sm text-foreground-secondary">Transcript:</p>
	<div class="p-1 -mt-2 text-sm text-muted-foreground">
		<p>{transcription}</p>
	</div>
{/if}
