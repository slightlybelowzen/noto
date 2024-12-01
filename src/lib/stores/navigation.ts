import { writable } from 'svelte/store';

export const selectedItem = writable<{ title: string; url: string } | null>(null);
