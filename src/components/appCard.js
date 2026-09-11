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

  const mainStages = STAGES.slice(0, 5);
  const reached = Math.min(activeIdx, mainStages.length - 1);

  const card = h(
    'div',
    {
      class: `app-card${isRejected ? ' is-rejected' : ''}${isHired ? ' is-hired' : ''}`,
      style: `--card-border: ${meta.color};`,
      role: 'button',
      tabindex: '0',
      'aria-label': `${app.company} — ${app.role}`,
      onclick: () => onOpen(app),
      onkeydown: (e) => (e.key === 'Enter' || e.key === ' ') && onOpen(app),
    },
    // Header
    h('div', { class: 'app-card__top' },
      h('div', { class: 'min-w-0' },
        h('div', { class: 'app-card__company truncate' }, app.company),
        h('div', { class: 'app-card__role truncate' }, app.role),
      ),
      h('span', {
        class: 'app-card__badge',
        style: `border-color:${meta.color}44; color:${meta.color};`
      },
        meta.label
      )
    ),

    // Clean Stepper Progress (solid progress lines, no gaudy gradients)
    h('div', { class: 'rungs', 'aria-hidden': 'true' },
      mainStages.map((s, i) => {
        let isFilled = i <= reached;
        if (isRejected || isHired) isFilled = true;
        return h('span', {
          class: `rung${isFilled ? ' is-reached' : ''}`,
          style: isFilled ? `background-color: ${meta.color};` : ''
        });
      })
    ),

    // Meta details (Date, Location, Salary)
    h('div', { class: 'app-card__meta' },
      h('div', { class: 'app-card__meta-item' },
        iconEl('calendar', 12),
        fmtDateShort(app.appliedAt),
        h('span', { style: 'color:var(--text-faint);' },
          days === 0 ? '· Hari ini' : days === 1 ? '· Kemarin' : `· ${days} hari lalu`
        )
      ),
      app.location
        ? h('div', { class: 'app-card__meta-item' }, iconEl('mapPin', 12), app.location)
        : null,
      app.salary
        ? h('div', { class: 'app-card__meta-item' }, iconEl('briefcase', 12), app.salary)
        : null
    ),

    // Latest activity snippet
    lastLog
      ? h('div', { class: 'app-card__log' },
          iconEl('note', 11),
          h('span', { class: 'truncate' }, lastLog.text)
        )
      : null,

    // Action buttons (Advance, Back, Decline) and click hint
    (() => {
      const nextStage = activeIdx < STAGES.length - 1 ? STAGES[activeIdx + 1].label : '';
      const prevStage = activeIdx > 0 ? STAGES[activeIdx - 1].label : '';

      return h('div', { class: 'app-card__actions' },
        h('span', { class: 'card-click-hint', style: 'margin-right:auto;' },
          iconEl('note', 11),
          'Klik untuk detail'
        ),
        !isRejected && !isHired && activeIdx > 0
          ? h('button', {
              class: 'action-btn',
              title: `Mundur ke tahap ${prevStage}`,
              'aria-label': `Mundur ke tahap ${prevStage}`,
              onclick: (e) => { e.stopPropagation(); onBack?.(app); }
            },
              h('span', { html: iconHTML('arrowDown', 13) })
            )
          : null,
        !isRejected && !isHired && activeIdx < STAGES.length - 1
          ? h('button', {
              class: 'action-btn',
              style: 'color:var(--brand); border-color:var(--brand-border);',
              title: `Naik ke tahap ${nextStage}`,
              'aria-label': `Naik ke tahap ${nextStage}`,
              onclick: (e) => { e.stopPropagation(); onAdvance?.(app); }
            },
              h('span', { html: iconHTML('arrowUp', 13) })
            )
          : null,
        !isRejected && !isHired
          ? h('button', {
              class: 'action-btn action-btn--danger',
              title: 'Tandai lamaran ditolak',
              'aria-label': 'Tandai lamaran ditolak',
              onclick: (e) => { e.stopPropagation(); onDecline?.(app); }
            },
              h('span', { html: iconHTML('x', 13) })
            )
          : null
      );
    })()
  );

  return card;
}