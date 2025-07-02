// src/routes/events/[eventId]/+page.ts
export const load = async ({ fetch }) => {
  const res = await fetch('/events.json');
  const json = await res.json();
  return {
    events: json.events
  };
};

