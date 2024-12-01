<script lang="ts">
	import '../app.css';
	import AppSidebar from '$lib/components/layout/app-sidebar.svelte';
	import { selectedItem } from '$lib/stores/navigation';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	const { children } = $props();
</script>

<svelte:head>
	<title>Prakhars Notion</title>
</svelte:head>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header class="flex h-10 shrink-0 items-center gap-2 border-b px-4">
			<Sidebar.Trigger class="-ml-1" />
			<Separator orientation="vertical" class="mr-2 h-4" />
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item class="hidden md:block">
						<Breadcrumb.Link href="/">Prakhar Nagpal</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator class="hidden md:block" />
					<Breadcrumb.Item class="text-primary">
						<Breadcrumb.Link href={$selectedItem?.url || '/'}>
							{$selectedItem?.title || '/'}</Breadcrumb.Link
						>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</header>
		<!-- <div class="flex flex-1 flex-col gap-4 p-2"> -->
		<div class="flex-1 p-2">
			{@render children()}
		</div>
		<!-- </div> -->
	</Sidebar.Inset>
</Sidebar.Provider>
