// appCard — kartu lamaran di board

import { h, fmtDateShort, daysSince } from '../lib/util.js';
import { stageMeta, STAGES, TERMINAL } from '../lib/store.js';
import { iconEl, iconHTML } from './icons.js';

export function renderCard(app, { onOpen, onAdvance, onBack, onDecline }) {
  const meta = stageMeta(app.stage);
  const activeIdx = STAGES.findIndex((s) => s.key === app.stage);
  const isRejected = app.stage === 'rejected';
  const isHired = app.stage === 'hired';
  const lastLog = app.logs?.at(-1);
  const days = daysSince(app.appliedAt);

  // tangga progress: rung terisi = panggung terlewati (interview sebagai puncak, offer/hired/rejected lanjut)
  const rungs = STAGES.slice(0, 5); // sampai "Tawaran"
  const reached = Math.min(activeIdx, rungs.length - 1);

  const card = h(
    'div',
    {
      class: `app-card${isRejected ? ' is-rejected' : ''}${isHired ? ' is-hired' : ''}`,
      style: `--card-accent:${meta.color}; --card-glow:${meta.color}33;`,
      role: 'button',
      tabindex: '0',
      'aria-label': `${app.company} — ${app.role}`,
      onclick: () => onOpen(app),
      onkeydown: (e) => (e.key === 'Enter' || e.key === ' ') && onOpen(app),
    },
    h('div', { class: 'app-card__top' },
      h('div', {},
        h('div', { class: 'app-card__company' }, app.company),
        h('div', { class: 'app-card__role' }, app.role),
      ),
      h('span', { class: 'chip app-card__type', style: `border-color:${meta.color}44; color:${meta.color};` },
        iconEl('target', 11),
        stageMeta(app.stage).label
      ),
    ),
    h('div', { class: 'rungs', 'aria-hidden': 'true' },
      rungs.map((s, i) => {
        let cls = 'rung';
        if (i <= reached - 1) cls += ' is-reached';
        else if (i === reached && !TERMINAL.includes(app.stage)) cls += ' is-current';
        else cls += ' is-locked';
        return h('span', { class: cls });
      })
    ),
    h('div', { class: 'app-card__meta' },
      h('span', {}, iconEl('calendar', 12), fmtDateShort(app.appliedAt),
        days === 0 ? ' (hari ini)' : days === 1 ? ' (kemarin)' : ` (${days}h)`),
      app.location
        ? h('span', {}, iconEl('mapPin', 12), app.location)
        : null,
      app.salary
        ? h('span', {}, iconEl('briefcase', 12), app.salary)
        : null,
    ),
    lastLog
      ? h('div', { class: 'app-card__last', style: 'font-size:.72rem;color:var(--text-faint);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;' },
          iconEl('note', 11), lastLog.text)
      : null,
    h('div', { class: 'app-card__actions', style: 'display:flex;gap:6px;justify-content:flex-end;' },
      !isRejected && !isHired && activeIdx > 0
        ? h('button', { class: 'icon-btn', title: 'Mundur satu tahap', 'aria-label': 'Mundur',
            onclick: (e) => { e.stopPropagation(); onBack?.(app); } },
            h('span', { html: iconHTML('arrowDown', 14) }))
        : null,
      !isRejected && !isHired && activeIdx < STAGES.length - 1
        ? h('button', { class: 'icon-btn', title: 'Naik satu tahap', 'aria-label': 'Naik',
            onclick: (e) => { e.stopPropagation(); onAdvance?.(app); } },
            h('span', { html: iconHTML('arrowUp', 14) }))
        : null,
      !isRejected && !isHired
        ? h('button', { class: 'icon-btn', title: 'Tandai ditolak', 'aria-label': 'Tandai ditolak',
            onclick: (e) => { e.stopPropagation(); onDecline?.(app); } },
            h('span', { html: iconHTML('x', 14) }))
        : null,
    )
  );
  return card;
}