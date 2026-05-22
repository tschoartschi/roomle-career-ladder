import { writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

// Grid polygon points for each level (from the SVG grid rings)
const GRID_POINTS = {
  1: [[250,218], [281,241], [267,275], [233,275], [219,241]],
  2: [[250,186], [311,232], [286,302], [214,302], [189,232]],
  3: [[250,154], [341,224], [305,329], [195,329], [159,224]],
  4: [[250,122], [372,215], [325,356], [175,356], [128,215]],
  5: [[250,90], [402,207], [344,383], [156,383], [98,207]],
};

// Verbs per axis per level
// Axes order: Technical Mastery, Learning, Responsibility, Collaboration, Influence
const VERBS = {
  1: ['Applies', 'Adopts', 'Acknowledges', 'Contributes', 'Observes'],
  2: ['Solves', 'Grows', 'Owns', 'Collaborates', 'Contributes'],
  3: ['Designs', 'Explores', 'Drives', 'Facilitates', 'Influences'],
  4: ['Masters', 'Educates', 'Empowers', 'Leads', 'Leads'],
  5: ['Creates', 'Evangelizes', 'Mentors', 'Advocates', 'Shapes'],
};

// Labels outside for levels 1-3, inside the polygon for levels 4-5
function getLabelOffsets(level: number) {
  if (level >= 4) {
    return [
      { dx: 0, dy: 18, anchor: 'middle' },
      { dx: -15, dy: 4, anchor: 'end' },
      { dx: -13, dy: -8, anchor: 'end' },
      { dx: 13, dy: -8, anchor: 'start' },
      { dx: 15, dy: 4, anchor: 'start' },
    ];
  }
  return [
    { dx: 0, dy: -10, anchor: 'middle' },
    { dx: 15, dy: -4, anchor: 'start' },
    { dx: 13, dy: 10, anchor: 'start' },
    { dx: -13, dy: 10, anchor: 'end' },
    { dx: -15, dy: -4, anchor: 'end' },
  ];
}

function generateSvg(level: number): string {
  const points = GRID_POINTS[level];
  const verbs = VERBS[level];
  const polyStr = points.map(p => p.join(',')).join(' ');
  const labelOffsets = getLabelOffsets(level);

  const verbLabels = points.map((p, i) => {
    const off = labelOffsets[i];
    const x = p[0] + off.dx;
    const y = p[1] + off.dy;
    return `  <text x="${x}" y="${y}" class="verb-label" style="text-anchor:${off.anchor};">${verbs[i]}</text>`;
  }).join('\n');

  const circles = points.map(p =>
    `  <circle class="data-point" cx="${p[0]}" cy="${p[1]}" r="5" />`
  ).join('\n');

  // Tight viewBox to minimize padding: content spans x:50-450, y:58-418
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="35 55 430 370" width="430" height="370">
  <defs>
    <style>
      .grid { fill: none; stroke: #ddd; stroke-width: 1; }
      .axis-line { stroke: #ccc; stroke-width: 1; }
      .data-area { fill: rgba(66, 133, 244, 0.25); stroke: #4285f4; stroke-width: 2.5; }
      .data-point { fill: #4285f4; }
      .label { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px; fill: #333; text-anchor: middle; }
      .level-label { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 10px; fill: #999; text-anchor: end; }
      .verb-label { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 11px; fill: #1a56db; font-weight: 600; paint-order: stroke; stroke: white; stroke-width: 3px; }
    </style>
  </defs>

  <!-- Grid pentagons (levels 1-5) -->
  <polygon class="grid" points="250,90 402,207 344,383 156,383 98,207" />
  <polygon class="grid" points="250,122 372,215 325,356 175,356 128,215" />
  <polygon class="grid" points="250,154 341,224 305,329 195,329 159,224" />
  <polygon class="grid" points="250,186 311,232 286,302 214,302 189,232" />
  <polygon class="grid" points="250,218 281,241 267,275 233,275 219,241" />

  <!-- Axis lines from center to vertices -->
  <line class="axis-line" x1="250" y1="250" x2="250" y2="90" />
  <line class="axis-line" x1="250" y1="250" x2="402" y2="207" />
  <line class="axis-line" x1="250" y1="250" x2="344" y2="383" />
  <line class="axis-line" x1="250" y1="250" x2="156" y2="383" />
  <line class="axis-line" x1="250" y1="250" x2="98" y2="207" />

  <!-- Data polygon -->
  <polygon class="data-area" points="${polyStr}" />

  <!-- Data points -->
${circles}

  <!-- Verb labels at data points -->
${verbLabels}

  <!-- Axis labels -->
  <text x="250" y="72" class="label">Technical Mastery</text>
  <text x="420" y="200" class="label">Learning</text>
  <text x="365" y="405" class="label">Responsibility</text>
  <text x="135" y="405" class="label">Collaboration</text>
  <text x="75" y="200" class="label">Influence</text>

  <!-- Level indicators (left of top axis) -->
  <text x="242" y="93" class="level-label">5</text>
  <text x="242" y="125" class="level-label">4</text>
  <text x="242" y="157" class="level-label">3</text>
  <text x="242" y="189" class="level-label">2</text>
  <text x="242" y="221" class="level-label">1</text>
</svg>
`;
}

const charts = [
  { level: 1, name: '01-junior-radar' },
  { level: 2, name: '02-expert-radar' },
  { level: 3, name: '03-senior-l1-radar' },
  { level: 4, name: '04a-senior-l2-tech-radar' },
  { level: 4, name: '04b-senior-l2-mgmt-radar' },
  { level: 5, name: '05a-lead-tech-radar' },
  { level: 5, name: '05b-lead-mgmt-radar' },
];

const assetsDir = path.resolve('docs/assets/levels');
mkdirSync(assetsDir, { recursive: true });

for (const chart of charts) {
  const svg = generateSvg(chart.level);
  const svgPath = path.join(assetsDir, `${chart.name}.svg`);
  const pngPath = path.join(assetsDir, `${chart.name}.png`);
  writeFileSync(svgPath, svg);
  execSync(`magick -density 200 -background white "${svgPath}" "${pngPath}"`);
  console.log(`Created: ${chart.name}.png`);
}
