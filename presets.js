/* Rule presets and consistency guidance. */
window.CHALLENGE_PRESETS = [
  {
    id: '75hard',
    days: 75,
    name: '75 Hard classic',
    desc: 'The original five critical tasks. Zero substitutions, zero days off.',
    rules: [
      { name: 'Two 45-minute workouts', desc: 'One session has to be outdoors, whatever the weather.' },
      { name: 'Follow your diet', desc: 'No cheat meals, no alcohol — whatever plan you picked.' },
      { name: 'Drink a gallon of water', desc: 'Finish it before evening so sleep stays intact.' },
      { name: 'Read 10 pages', desc: 'Non-fiction, paper — not audio.' },
      { name: 'Take a progress photo', desc: 'Same light, same spot, every single day.' },
    ],
  },
  {
    id: '75soft',
    days: 75,
    name: '75 Soft',
    desc: 'The same length, a life that still fits around it.',
    rules: [
      { name: 'One 45-minute workout', desc: 'Any intensity — a walk counts on the hard days.' },
      { name: 'Drink 3 liters of water', desc: 'Keep a bottle within reach all day.' },
      { name: 'Read 10 pages', desc: 'Fiction or non-fiction, your call.' },
      { name: '10 minutes of stillness', desc: 'No phone, no input — breathe or meditate.' },
      { name: 'One honest food log', desc: 'No forbidden foods here — just write it down.' },
    ],
  },
  {
    id: 'morning',
    days: 30,
    name: 'Morning reset',
    desc: 'Win the first hour and the rest of the day negotiates with you.',
    rules: [
      { name: 'Wake at a fixed time', desc: 'Same time every day, weekends included.' },
      { name: 'Move for 20 minutes', desc: 'Walk, stretch, lift — anything before screens.' },
      { name: 'No phone for the first hour', desc: 'It sets the tone for everything after.' },
      { name: 'Write three lines', desc: 'What matters today, what you are grateful for, what to let go.' },
    ],
  },
  {
    id: 'momentum',
    days: 30,
    name: 'Momentum 30',
    desc: 'Four small rules built to survive a busy calendar.',
    rules: [
      { name: '30 minutes of focused work', desc: 'One task, no tabs, no notifications.' },
      { name: '8,000 steps', desc: 'Spread across the day, not all at once.' },
      { name: 'One page of reading', desc: 'Small enough that there is never a reason to skip.' },
      { name: 'Lights out by 23:00', desc: 'Sleep is the rule that protects the other three.' },
    ],
  },
];

window.CHALLENGE_TIPS = [
  {
    title: 'Write the rule as a completion test',
    body: '"Move 30 minutes" is a mood. "30 minutes of walking before 8am" is something you can check off without arguing with yourself.',
  },
  {
    title: 'Prepare the night before',
    body: 'Bottle filled, clothes out, book on the pillow. Every decision you remove tonight is willpower you keep tomorrow.',
  },
  {
    title: 'Shrink the worst day, never skip it',
    body: 'A ten-minute version of the rule still counts. The chain breaks on the zero day, not the small one.',
  },
  {
    title: 'Never miss twice',
    body: 'One missed day is noise. Two in a row is a new pattern — so the next day matters more than the last one did.',
  },
  {
    title: 'Log before bed',
    body: 'Tick the boxes while the details are still fresh. The notes are what you will actually reread in week six.',
  },
];
