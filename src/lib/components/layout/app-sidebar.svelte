<script lang="ts">
	import FileText from 'lucide-svelte/icons/file-text';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { selectedItem } from '$lib/stores/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { items } from '$lib/data/sidebarItems';

	function handleSelect(item: (typeof items)[number]) {
		selectedItem.set(item);
	}
	onMount(() => {
		const currentItem = items.find((item) => item.url === $page.url.pathname);
		if (currentItem) {
			selectedItem.set(currentItem);
		}
	});
</script>

<Sidebar.Root collapsible="offcanvas">
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Notes</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu class="-space-y-2">
					{#each items as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={item.url} {...props} on:click={() => handleSelect(item)}>
										<FileText />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<!-- <Sidebar.Footer class="mb-4"> -->
		<!-- <VoiceRecorder /> -->
	<!-- </Sidebar.Footer> -->
</Sidebar.Root>
