import { notes } from '$lib/data/notes';
import { error } from '@sveltejs/kit';

export function load({ params }: { params: { id: string } }) {
	const noteId = parseInt(params.id);
	const noteContent = notes[noteId - 1];

	if (noteContent === undefined) {
		throw error(404, 'Note not found');
	}

	return {
		noteContent,
		noteId
	};
}
