<script context="module" lang="ts">
	export interface LeaderboardEntry {
		team_id?: string;
		team_name?: string;
		participant_id?: string;
		name?: string;
		points: string | number;
	}

	export interface Event {
		event_id: string;
		event_name: string;
		event_description: string;
		event_start_datetime: string;
		event_end_datetime: string;
		venue: string;
		poster_image: string;
		leaderboard: LeaderboardEntry[];
		feedback_form: string;
		post_event_task: string;
		resources: string[];
		gallery: string[];
	}
</script>

<script lang="ts">
	import { error } from '@sveltejs/kit';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let data: { events: Event[] };

	let showRSVPModal = false;
	let showConfirmation = false;
	let email = '';
	let scholarId = '';

	const eventId = $page.params.eventId;
	const event = data.events.find((e) => e.event_id === eventId);

	if (!event) throw error(404, 'Event not found');

	const now = new Date();
	const startDate = new Date(event.event_start_datetime);
	const endDate = new Date(event.event_end_datetime);

	const isUpcoming = now < startDate;
	const isOngoing = now >= startDate && now <= endDate;
	const isPast = now > endDate;

	function handleRSVP() {
		showRSVPModal = true;
		showConfirmation = false;
	}

	function submitRSVP() {
		console.log('RSVP submitted:', { email, scholarId });
		showRSVPModal = false;
		showConfirmation = true;
		email = '';
		scholarId = '';

		setTimeout(() => {
			showConfirmation = false;
		}, 4000);
	}

	// auto-scroll gallery for past events

	onMount(() => {
		if (isPast && event.gallery?.length > 0) {
			const gallery = document.querySelector('.gallery-scroller');
			if (!gallery) return;

			// Clone items for seamless looping
			gallery.innerHTML += gallery.innerHTML;

			const items = gallery.querySelectorAll('.gallery-item');
			if (items.length === 0) return;

			const itemWidth = items[0].clientWidth;
			const gap = 24; // matches gap-6 (1.5rem)
			const scrollAmount = itemWidth + gap;
			let currentIndex = 0;
			let isPaused = false;
			let scrollInterval;

			// Pause control
			gallery.addEventListener('mouseenter', () => (isPaused = true));
			gallery.addEventListener('mouseleave', () => (isPaused = false));

			const scrollToNext = () => {
				if (isPaused) return;

				currentIndex++;
				gallery.scrollTo({
					left: currentIndex * scrollAmount,
					behavior: 'smooth'
				});

				// Reset when we reach the cloned set
				if (currentIndex >= items.length / 2) {
					setTimeout(() => {
						currentIndex = 0;
						gallery.scrollTo({
							left: 0,
							behavior: 'auto'
						});
					}, 300);
				}
			};

			// Scroll every 1 seconds
			scrollInterval = setInterval(scrollToNext, 1000);

			return () => clearInterval(scrollInterval);
		}
	});
</script>

<section class="min-h-screen bg-[#121212] pt-16 text-gray-100">
	<!-- Fixed Back Button -->
	<div class="fixed left-0 top-0 z-40 w-full bg-[#121212] px-6 py-4 shadow-md">
		<a href="/" class="flex items-center text-orange-400 transition-colors hover:text-orange-300">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="30"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="mr-1"
			>
				<line x1="19" y1="12" x2="5" y2="12"></line>
				<polyline points="12 19 5 12 12 5"></polyline>
			</svg>
			Back to Events
		</a>
	</div>

	<!-- RSVP Modal -->
	{#if showRSVPModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
			<div class="w-full max-w-md rounded-xl border border-gray-700 bg-[#121212] p-6 shadow-2xl">
				<h3 class="mb-4 text-xl font-semibold text-orange-400">RSVP for {event.event_name}</h3>
				<div class="space-y-4">
					<div>
						<label for="email" class="mb-1 block text-sm font-medium text-gray-300"
							>Institute Email</label
						>
						<input
							type="email"
							id="email"
							bind:value={email}
							class="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
							placeholder="nit_ug_24@cse.nits.in"
							required
						/>
					</div>
					<div>
						<label for="scholarId" class="mb-1 block text-sm font-medium text-gray-300"
							>Scholar ID</label
						>
						<input
							type="text"
							id="scholarId"
							bind:value={scholarId}
							class="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
							placeholder="Your scholar ID"
							required
						/>
					</div>
					<div class="flex justify-end space-x-3 pt-2">
						<button
							on:click={() => (showRSVPModal = false)}
							class="rounded-lg px-4 py-2 font-medium text-gray-300 hover:bg-gray-700"
						>
							Cancel
						</button>
						<button
							on:click={submitRSVP}
							class="rounded-lg bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600"
						>
							Submit
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- RSVP Confirmation -->
	{#if showConfirmation}
		<div
			class="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform rounded-lg bg-green-600 px-6 py-3 text-white shadow-lg"
		>
			<div class="flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="mr-2"
				>
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
					<polyline points="22 4 12 14.01 9 11.01"></polyline>
				</svg>
				<span>RSVP confirmed! See you at the event.</span>
			</div>
		</div>
	{/if}

	<div class="container mx-auto max-w-7xl px-6 lg:px-8">
		<div class="relative pb-12 pt-8">
			<!-- Header -->
			<div class="flex flex-col items-center">
				<h1
					class="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl"
				>
					{event.event_name}
				</h1>
			</div>

			<!-- For Upcoming/Ongoing Events - Side by Side Layout -->
			{#if !isPast}
				<div class="mt-8 flex flex-col gap-8 lg:flex-row">
					<!-- Poster on Left -->
					<div class="lg:w-1/2">
						<div class="overflow-hidden rounded-xl shadow-2xl">
							<img
								src={`/${event.poster_image}`}
								alt={event.event_name}
								class="h-full w-full object-cover"
							/>
						</div>
					</div>

					<!-- Details on Right -->
					<div class="lg:w-1/2">
						<div class="space-y-8">
							<!-- Event Description -->
							<div class="rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
								<h2 class="mb-3 flex items-center text-xl font-semibold text-[#FF7700]">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="mr-2"
									>
										<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
										<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
									</svg>
									About This Event
								</h2>
								<div class="prose prose-invert max-w-none text-gray-300">
									<p class="text-lg leading-relaxed">{event.event_description}</p>
									{#if event.venue}
										<div class="mt-4 flex items-start text-amber-100 sm:items-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="18"
												height="18"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
												class="mr-2 mt-1 flex-shrink-0 sm:mt-0"
											>
												<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
												<circle cx="12" cy="10" r="3"></circle>
											</svg>
											<div class="flex flex-col sm:flex-row sm:items-center">
												<span class="font-medium">Location :</span>
												<span class="ml-1">{event.venue}</span>
											</div>
										</div>
									{/if}
								</div>
							</div>

							<!-- Event Details Card -->
							<div class="rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
								<h2 class="mb-4 text-xl font-semibold text-[#FF7700]">Event Details</h2>

								<!-- Timeline -->
								<div class="mb-6 flex items-start">
									<div class="flex-shrink-0 rounded-lg bg-orange-400/10 p-3">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="text-orange-400"
										>
											<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
											<line x1="16" y1="2" x2="16" y2="6"></line>
											<line x1="8" y1="2" x2="8" y2="6"></line>
											<line x1="3" y1="10" x2="21" y2="10"></line>
										</svg>
									</div>

									<div class="ml-4">
										<h3 class="text-lg font-medium text-gray-100">Timeline</h3>
										<div class="mt-2 space-y-1 text-gray-300">
											<p class="flex items-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
													class="mr-2 text-amber-400"
												>
													<circle cx="12" cy="12" r="10"></circle>
													<polyline points="12 6 12 12 16 14"></polyline>
												</svg>
												<span class="font-medium">Starts :</span>
												{#if isOngoing}
													<span class="ml-1 text-white"
														>{new Date(event.event_start_datetime).toLocaleString('en-IN')}</span
													>
												{:else}
													<span class="ml-1 text-white"> Upcoming</span>
												{/if}
											</p>
											<p class="flex items-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
													class="mr-2 text-amber-400"
												>
													<circle cx="12" cy="12" r="10"></circle>
													<polyline points="12 6 12 12 16 14"></polyline>
												</svg>

												<span class="font-medium">Ends :</span>
												{#if isOngoing}
													<span class="ml-1 text-white"> Ongoing</span>
												{:else}
													<span class="ml-1 text-white"> Upcoming</span>
												{/if}
											</p>
											<p class="flex items-center text-orange-400">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
													class="mr-2"
												>
													<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
												</svg>
												<span class="font-medium">Status :</span>
												{#if isUpcoming}
													<span class="ml-1">Not Started Yet</span>
												{:else}
													<span class="ml-1">Happening Now</span>
												{/if}
											</p>
										</div>
									</div>
								</div>

								<!-- RSVP Button -->
								<div class="mt-6">
									<button
										on:click={handleRSVP}
										class="w-full rounded-lg bg-orange-500 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-600"
									>
										RSVP Now
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			{:else}
				<!-- For Past Events - Stacked Layout -->
				<div class="mt-8 space-y-8">
					<!-- Photo Gallery - Smooth Auto-scrolling -->
					{#if isPast && event.gallery?.length > 0}
						<div class="mt-8">
							<h2 class="mb-6 text-2xl font-semibold text-[#FF7700]">Event Gallery</h2>
							<div class="relative overflow-hidden">
								<!-- Gallery Container -->
								<div class="gallery-scroller scrollbar-hide flex gap-6 overflow-x-auto">
									{#each event.gallery as image (image)}
										<div
											class="gallery-item h-96 w-[85vw] flex-shrink-0 overflow-hidden rounded-xl shadow-lg sm:w-[calc(50%-1.5rem)] md:w-[calc(33%-1.5rem)]"
										>
											<img
												src={`/${image}`}
												alt="Event photo"
												class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
											/>
										</div>
									{/each}
								</div>
							</div>
						</div>
					{/if}

					<!-- Event Description -->
					<div class="rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
						<h2 class="mb-3 flex items-center text-xl font-semibold text-[#FF7700]">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="mr-2"
							>
								<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
								<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
							</svg>
							About This Event
						</h2>
						<div class="prose prose-invert max-w-none text-gray-300">
							<p class="text-lg leading-relaxed">{event.event_description}</p>
							{#if event.venue}
								<div class="mt-4 flex items-start text-amber-100 sm:items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="mr-2 mt-1 flex-shrink-0 sm:mt-0"
									>
										<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
										<circle cx="12" cy="10" r="3"></circle>
									</svg>
									<div class="flex flex-col sm:flex-row sm:items-center">
										<span class="font-medium">Location :</span>
										<span class="ml-1">{event.venue}</span>
									</div>
								</div>
							{/if}
						</div>
					</div>

					<!-- Event Details Card -->
					<div class="rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
						<h2 class="mb-4 text-xl font-semibold text-[#FF7700]">Event Details</h2>

						<!-- Timeline -->
						<div class="mb-6 flex items-start">
							<div class="flex-shrink-0 rounded-lg bg-orange-400/10 p-3">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="text-orange-400"
								>
									<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
									<line x1="16" y1="2" x2="16" y2="6"></line>
									<line x1="8" y1="2" x2="8" y2="6"></line>
									<line x1="3" y1="10" x2="21" y2="10"></line>
								</svg>
							</div>

							<div class="ml-4">
								<h3 class="text-lg font-medium text-gray-100">Timeline</h3>
								<div class="mt-2 space-y-1 text-gray-300">
									<p class="flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="mr-2 text-amber-400"
										>
											<circle cx="12" cy="12" r="10"></circle>
											<polyline points="12 6 12 12 16 14"></polyline>
										</svg>
										<span class="font-medium">Starts :</span>
										<span class="ml-1"
											>{new Date(event.event_start_datetime).toLocaleString('en-IN')}</span
										>
									</p>
									<p class="flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="mr-2 text-amber-400"
										>
											<circle cx="12" cy="12" r="10"></circle>
											<polyline points="12 6 12 12 16 14"></polyline>
										</svg>

										<span class="font-medium">Ends :</span>
										<span class="ml-1"
											>{new Date(event.event_end_datetime).toLocaleString('en-IN')}</span
										>
									</p>
									<p class="flex items-center text-orange-400">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="mr-2"
										>
											<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
										</svg>
										<span class="font-medium">Status :</span>
										<span class="ml-1">Completed</span>
									</p>
								</div>
							</div>
						</div>

						<!-- Resources section -->
						{#if event.resources?.length > 0}
							<div class="mb-6 flex items-start">
								<div class="flex-shrink-0 rounded-lg bg-blue-400/10 p-3">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="text-blue-400"
									>
										<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
										<polyline points="14 2 14 8 20 8"></polyline>
										<line x1="16" y1="13" x2="8" y2="13"></line>
										<line x1="16" y1="17" x2="8" y2="17"></line>
										<polyline points="10 9 9 9 8 9"></polyline>
									</svg>
								</div>
								<div class="ml-4">
									<h3 class="text-lg font-medium text-gray-100">Resources</h3>
									<div class="mt-2">
										<ul class="space-y-2 text-gray-300">
											{#each event.resources as resource, index}
												<li>
													<a
														href={resource}
														target="_blank"
														rel="noopener"
														class="flex items-center text-blue-400 hover:underline"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="16"
															height="16"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															stroke-width="2"
															stroke-linecap="round"
															stroke-linejoin="round"
															class="mr-2"
														>
															<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
															<polyline points="7 10 12 15 17 10"></polyline>
															<line x1="12" y1="15" x2="12" y2="3"></line>
														</svg>
														Resource {index + 1}
													</a>
												</li>
											{/each}
										</ul>
									</div>
								</div>
							</div>
						{/if}

						<!-- Leaderboard -->
						{#if event.leaderboard?.length > 0}
							<div class="mb-6 flex items-start">
								<div class="flex-shrink-0 rounded-lg bg-purple-400/10 p-3">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="text-purple-400"
									>
										<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
										<path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
										<path d="M4 22h16"></path>
										<path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
										<path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
										<path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
									</svg>
								</div>
								<div class="ml-4">
									<h3 class="text-lg font-medium text-gray-100">Leaderboard</h3>
									<div class="mt-2">
										<ol
											class="list-inside list-decimal space-y-2 text-gray-300 marker:text-orange-400"
										>
											{#each event.leaderboard as team}
												<li class="pl-2">
													<span class="font-medium text-amber-200">{team.team_name}</span>
													<span class="ml-2 text-purple-300">{team.points} points</span>
												</li>
											{/each}
										</ol>
									</div>
								</div>
							</div>
						{/if}

						<!-- Task Details -->
						{#if event.post_event_task}
							<div class="mb-6">
								<h2 class="text-lg font-medium text-[#FF7700]">Task Details</h2>
								<p class="leading-relaxed text-amber-100">{event.post_event_task}</p>
							</div>
						{/if}

						<!-- Feedback Form -->
						{#if event.feedback_form}
							<div class="mt-4 flex flex-col gap-4 sm:flex-row">
								<a
									href={event.feedback_form}
									target="_blank"
									rel="noopener"
									class="flex flex-1 items-center justify-center rounded-lg bg-[#FF7700] px-6 py-3 font-medium text-white transition-colors hover:bg-orange-600"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="mr-2"
									>
										<path d="M21.5 12a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"></path>
										<path d="M12 16v-4"></path>
										<path d="M12 8h.01"></path>
									</svg>
									Submit Feedback
								</a>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.gallery-scroller {
		-ms-overflow-style: none;
		scrollbar-width: none;
		scroll-snap-type: x mandatory;
	}
	.gallery-scroller::-webkit-scrollbar {
		display: none;
	}
	.gallery-item {
		scroll-snap-align: start;
	}
</style>
