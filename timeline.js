const timelineEvents = [
  {
    id: 1,
    year: 2027,
    title: 'Emotion-Aware Interfaces',
    category: 'AI',
    summary: 'Assistive systems begin reading tone, pace, and ambiguity to guide digital experiences with emotional context.',
    description: 'In this fictional scenario, software adapts to human emotional rhythm rather than simply reacting to commands. Interfaces become more helpful because they understand urgency, mood, and uncertainty, improving everything from learning tools to household assistants.',
    detail: 'Fictional possibility: synthetic empathy becomes a widespread UX layer, and people learn to interact with subtle, context-aware digital companions.'
  },
  {
    id: 2,
    year: 2030,
    title: 'The Solar Commons',
    category: 'Environment',
    summary: 'Shared urban solar grids power neighbourhoods and transform local energy politics.',
    description: 'Cities invest in shared renewable systems, with energy flows visible on public dashboards. Communities trade surplus power, reducing dependence on centralized utilities and making environmental design more social and public.',
    detail: 'Fictional possibility: public energy becomes visible, democratic, and part of everyday urban culture.'
  },
  {
    id: 3,
    year: 2034,
    title: 'Orbital Greenhouses',
    category: 'Space',
    summary: 'Experimental agricultural research stations orbit Earth, designing resilient food systems for climate stress.',
    description: 'Off-world labs test atmospheric control, plant genetics, and resource loops that could refine terrestrial agriculture. These orbital facilities become both scientific laboratories and symbols of a new planetary imagination.',
    detail: 'Fictional possibility: space exploration becomes less about spectacle and more about climate resilience and ecological engineering.'
  },
  {
    id: 4,
    year: 2038,
    title: 'Synthetic Memory Rituals',
    category: 'Digital Life',
    summary: 'People curate AI-generated memory capsules reflecting identity, relationships, and personal history.',
    description: 'Memory tools allow individuals to shape a digital archive of moments, sensations, and stories. Rather than replacing memory, they become personal narrators that help people interpret and share lived experience.',
    detail: 'Fictional possibility: personal archives evolve into immersive, self-authored histories designed for reflection and connection.'
  },
  {
    id: 5,
    year: 2041,
    title: 'The Carbon Signal',
    category: 'Environment',
    summary: 'Every city tracks emissions in real time, turning invisible climate data into visible civic rituals.',
    description: 'Digital dashboards map everyday activity to carbon consequences. Public transit, food systems, and consumer choices become legible as part of a city-wide environmental performance index.',
    detail: 'Fictional possibility: climate awareness becomes embedded in design, public rituals, and local decision making.'
  },
  {
    id: 6,
    year: 2045,
    title: 'Personal Orbit',
    category: 'Digital Life',
    summary: 'People build personalized digital twins to model lifestyle, identity, and future decision-making.',
    description: 'A synthetic companion evolves to mirror a person’s goals, preferences, and creative tendencies. These systems help simulate different choices before real-world commitments are made.',
    detail: 'Fictional possibility: personas become living decision frameworks rather than simple apps or dashboards.'
  }
];

const state = {
  selectedId: null,
  filter: 'all',
  compareIds: []
};

function getFilteredEvents() {
  if (state.filter === 'all') return timelineEvents;
  return timelineEvents.filter((event) => event.category === state.filter);
}

function renderTimeline() {
  const timelineList = document.getElementById('timelineList');
  if (!timelineList) return;

  const events = getFilteredEvents();

  timelineList.innerHTML = `
    <div class="timeline-list">
      ${events.map((event) => `
        <button class="timeline-item ${state.selectedId === event.id ? 'selected' : ''}" type="button" data-event-id="${event.id}">
          <div class="year">${event.year}</div>
          <div>
            <h3>${event.title}</h3>
            <p>${event.summary}</p>
          </div>
          <span class="tag">${event.category}</span>
        </button>
      `).join('')}
    </div>
  `;

  timelineList.querySelectorAll('[data-event-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const eventId = Number(button.dataset.eventId);
      state.selectedId = eventId;
      renderTimeline();
      renderDetail();
    });
  });
}

function renderDetail() {
  const eventDetail = document.getElementById('eventDetail');
  if (!eventDetail) return;

  const selectedEvent = timelineEvents.find((event) => event.id === state.selectedId) || null;
  if (!selectedEvent) {
    eventDetail.className = 'event-detail empty-state-mini';
    eventDetail.innerHTML = '<p>Select a year to inspect a future scenario.</p>';
    return;
  }

  eventDetail.className = 'event-detail';
  eventDetail.innerHTML = `
    <span class="label">${selectedEvent.category}</span>
    <h3>${selectedEvent.year} / ${selectedEvent.title}</h3>
    <p>${selectedEvent.description}</p>
    <div class="visual-card">${selectedEvent.category}</div>
    <p>${selectedEvent.detail}</p>
  `;
}

function getCompareSelection() {
  const selectedEvents = timelineEvents.filter((event) => state.compareIds.includes(event.id));
  if (selectedEvents.length !== 2) return [];
  return selectedEvents;
}

function renderCompare() {
  const compareContent = document.getElementById('compareContent');
  if (!compareContent) return;

  const comparison = getCompareSelection();
  if (comparison.length !== 2) {
    compareContent.className = 'compare-content empty-state-mini';
    compareContent.innerHTML = '<p>Select two scenarios from the timeline to compare their social, technical, and cultural differences.</p>';
    return;
  }

  compareContent.className = 'compare-content';
  compareContent.innerHTML = comparison.map((event) => `
    <article class="compare-card">
      <p class="eyebrow">${event.category}</p>
      <h3>${event.year} — ${event.title}</h3>
      <ul>
        <li>${event.summary}</li>
        <li>${event.detail}</li>
      </ul>
    </article>
  `).join('');
}

function initTimelineControls() {
  const filterButtons = document.querySelectorAll('.filter-chip');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.filter = button.dataset.filter;
      filterButtons.forEach((chip) => chip.classList.toggle('active', chip === button));
      renderTimeline();
    });
  });

  const timelineList = document.getElementById('timelineList');
  if (timelineList) {
    timelineList.addEventListener('click', (event) => {
      const target = event.target.closest('[data-event-id]');
      if (!target) return;
      const eventId = Number(target.dataset.eventId);
      if (!state.compareIds.includes(eventId)) {
        if (state.compareIds.length >= 2) {
          state.compareIds.shift();
        }
        state.compareIds.push(eventId);
      }
      renderCompare();
    });
  }

  const compareButton = document.getElementById('compareButton');
  if (compareButton) {
    compareButton.addEventListener('click', () => {
      if (state.compareIds.length < 2) {
        showToast('Choose two scenarios first.', 'error');
        return;
      }
      renderCompare();
      showToast('Comparison updated.', 'success');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'timeline') return;
  state.selectedId = timelineEvents[0].id;
  renderTimeline();
  renderDetail();
  renderCompare();
  initTimelineControls();
});
