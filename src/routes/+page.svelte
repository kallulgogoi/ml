<script lang="ts">
	interface BaseLeaderboardEntry {
		points: number | string;
	}

	interface TeamEntry extends BaseLeaderboardEntry {
		team_id: string;
		team_name: string;
	}

	interface ParticipantEntry extends BaseLeaderboardEntry {
		participant_id: string;
		name: string;
	}

	type LeaderboardEntry = TeamEntry | ParticipantEntry;

	interface Event {
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
	}

	export let data: { events: Event[] };

	const events: Event[] = data.events;
	const now = new Date();

	const upcomingEvents = events.filter((event) => new Date(event.event_start_datetime) > now);
	const ongoingEvents = events.filter(
		(event) =>
			new Date(event.event_start_datetime) <= now && new Date(event.event_end_datetime) >= now
	);
	const pastEvents = events.filter((event) => new Date(event.event_end_datetime) < now);
</script>

<div class="min-h-screen bg-[#121212] px-4 py-12 text-[#C7C7C7]">
	<div class="mx-auto max-w-7xl">
		<!-- Header -->
		<div class="mb-12 text-center">
			<h1 class="mb-8 text-4xl font-bold text-[#FF7700]">Events</h1>
		</div>

		<!-- Ongoing Events -->
		{#if ongoingEvents.length > 0}
			<section class="mb-16">
				<div class="mb-8">
					<h2 class="flex items-center text-2xl font-bold">
						<span class="mr-3 inline-block h-3 w-3 animate-pulse rounded-full bg-orange-500"></span>
						Ongoing Events
					</h2>
				</div>

				<div class="hide-scrollbar overflow-x-auto scroll-smooth">
					<div class="flex w-max gap-8 pb-4">
						{#each ongoingEvents as event}
							<div class="w-80 flex-shrink-0">
								<div
									class="h-full rounded-xl bg-gray-800 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
								>
									<div class="relative h-48">
										<img
											src={event.poster_image}
											alt={event.event_name}
											class="h-full w-full object-cover"
										/>
										<div
											class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
										></div>
										<div
											class="absolute left-0 top-0 rounded-br-lg bg-orange-500 px-3 py-1 text-xs font-bold text-white"
										>
											LIVE
										</div>
									</div>
									<div class="p-6">
										<h3 class="mb-2 text-xl font-bold text-white">{event.event_name}</h3>
										<p class="mb-4 line-clamp-2 text-sm text-gray-400">{event.event_description}</p>

										<div class="mb-4 flex items-center text-sm text-gray-500">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="mr-1 h-4 w-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
												/>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
												/>
											</svg>
											{event.venue.split(',')[0]}
										</div>

										<div class="flex justify-between text-sm">
											<div class="flex items-center text-[#FF7700]">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="mr-1 h-4 w-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
												Ends {new Date(event.event_end_datetime).toLocaleDateString('en-IN')}
											</div>
											<a
												href={`/Events/${event.event_id}`}
												class="font-medium text-[#FF7700] hover:text-orange-300"
											>
												View Details →
											</a>
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</section>
		{/if}

		<!-- Upcoming Events -->
		{#if upcomingEvents.length > 0}
			<section class="mb-16">
				<div class="mb-8">
					<h2 class="text-2xl font-bold">Upcoming Events</h2>
				</div>

				<div class="hide-scrollbar overflow-x-auto scroll-smooth">
					<div class="flex w-max gap-8 pb-4">
						{#each upcomingEvents as event}
							<div class="w-80 flex-shrink-0">
								<div
									class="h-full rounded-xl bg-gray-800 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
								>
									<div class="relative h-48">
										<img
											src={event.poster_image}
											alt={event.event_name}
											class="h-full w-full object-cover"
										/>
										<div
											class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
										></div>
									</div>
									<div class="p-6">
										<h3 class="mb-2 text-xl font-bold text-white">{event.event_name}</h3>
										<p class="mb-4 line-clamp-2 text-sm text-gray-400">{event.event_description}</p>

										<div class="mb-4 flex items-center text-sm text-gray-500">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="mr-1 h-4 w-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
												/>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
												/>
											</svg>
											{event.venue.split(',')[0]}
										</div>

										<div class="flex justify-between text-sm">
											<div class="flex items-center text-blue-400">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="mr-1 h-4 w-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
												Starts {new Date(event.event_start_datetime).toLocaleDateString('en-IN')}
											</div>
											<a
												href={`/Events/${event.event_id}`}
												class="font-medium text-[#FF7700] hover:text-orange-300"
											>
												View Details →
											</a>
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</section>
		{/if}

		<!-- Past Events -->
		{#if pastEvents.length > 0}
			<section>
				<div class="mb-8">
					<h2 class="text-2xl font-bold">Past Events</h2>
				</div>

				<div class="hide-scrollbar overflow-x-auto scroll-smooth">
					<div class="flex w-max gap-8 pb-4">
						{#each pastEvents as event}
							<div class="w-80 flex-shrink-0">
								<div
									class="h-full rounded-xl bg-gray-800 opacity-80 shadow-lg transition hover:-translate-y-1 hover:opacity-100 hover:shadow-xl"
								>
									<div class="relative h-48">
										<img
											src={event.poster_image}
											alt={event.event_name}
											class="h-full w-full object-cover grayscale transition hover:grayscale-0"
										/>
										<div
											class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
										></div>
										<div
											class="absolute left-0 top-0 rounded-br-lg bg-gray-600 px-3 py-1 text-xs font-bold text-white"
										>
											ENDED
										</div>
									</div>
									<div class="p-6">
										<h3 class="mb-2 text-xl font-bold text-white">{event.event_name}</h3>
										<p class="mb-4 line-clamp-2 text-sm text-gray-400">{event.event_description}</p>

										<div class="mb-4 flex items-center text-sm text-gray-500">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="mr-1 h-4 w-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
												/>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
												/>
											</svg>
											{event.venue.split(',')[0]}
										</div>

										<div class="flex justify-between text-sm">
											<div class="flex items-center text-red-500">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="mr-1 h-4 w-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
												Ended {new Date(event.event_end_datetime).toLocaleDateString('en-IN')}
											</div>
											<a
												href={`/Events/${event.event_id}`}
												class="font-medium text-[#FF7700] hover:text-orange-300"
											>
												View Details →
											</a>
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</section>
		{/if}
	</div>
</div>

<style>
	/* Hide scrollbar cross-browser */
	.hide-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.hide-scrollbar {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
