// +page.server.ts
export const load = async ({ fetch }) => {
  try {
    const res = await fetch('/events.json'); // fetches from static/events.json
    if (!res.ok) throw new Error('Failed to fetch events');

    const json = await res.json();
    return {
      events: json.events // ✅ only pass the array
    };
  } catch (err) {
    console.error('Error loading events:', err);
    return { events: [] };
  }
};

