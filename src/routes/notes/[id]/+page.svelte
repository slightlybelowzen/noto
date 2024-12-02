<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { marked } from 'marked';
	let { data } = $props();

	$effect(() => {
		markdown = data.noteContent;
	});

	let markdown = $state(data.noteContent);
	let html = $derived(getProcessedHtml(markdown));
	let showPreview = $state(false);

	marked.setOptions({});

	function getProcessedHtml(md: string) {
		return marked(md);
	}
	function saveContent() {
		// TODO: implement db/save content in notes array
		console.log('save content');
	}

	function handleTranscriptCommand(event: CustomEvent) {
		const { type, transcript } = event.detail;

		if (type === 'crossTodos') {
			// Update markdown
			const lines = markdown.split('\n');
			const updatedLines = lines.map((line) => {
				if (line.trim().startsWith('- [ ]')) {
					return line.replace('- [ ]', '- [x]');
				}
				return line;
			});
			markdown = updatedLines.join('\n');
		}
	}
</script>

<div class="mx-1 mb-2 flex items-center justify-between">
	<p class="text-sm text-muted-foreground">
		You can use the button in the sidebar to activate the assistant. The AI assistant has context
		for everything in your knowledge base.
	</p>
	<div>
		<button
			class="rounded-md border px-3 py-0.5 text-sm hover:bg-muted hover:text-foreground"
			onclick={saveContent}
		>
			Save
		</button>
		<button
			class="rounded-md border px-3 py-0.5 text-sm hover:bg-muted hover:text-foreground"
			onclick={() => (showPreview = !showPreview)}
		>
			{showPreview ? 'Edit' : 'Preview'}
		</button>
	</div>
</div>

<div class="relative h-5/6">
	<Textarea
		bind:value={markdown}
		class="h-full w-full focus-visible:ring-1 focus-visible:ring-muted-foreground/80 focus-visible:ring-offset-0"
		placeholder="Edit the file and see the preview by clicking the preview button"
	/>
	{#if showPreview}
		<div
			class="md-prose absolute inset-0 overflow-y-auto rounded-md border bg-background px-3 py-2 text-sm"
		>
			{@html html}
		</div>
	{/if}
</div>
