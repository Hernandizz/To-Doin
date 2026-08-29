// view: Papan tahap (kanban)

import { h } from '../lib/util.js';
import { STAGES, TERMINAL, getState, setStage, moveStage } from '../lib/store.js';
import { renderCard } from '../components/appCard.js';
import { toast } from '../components/toast.js';
import { confirmDialog } from '../components/modal.js';

export function renderBoard(onOpen) {
  const apps = getState().apps;

  const columns = STAGES.map((stage, idx) => {
    const list = apps.filter((a) => a.stage === stage.key);
    const isTerminal = TERMINAL.includes(stage.key);

    const drop = h('div', { class: 'column__drop' },
      list.length === 0
        ? h('p', {
            style: 'font-size:0.75rem;color:var(--text-muted);border:1px dashed var(--border-strong);border-radius:6px;padding:20px 10px;text-align:center;background:var(--bg);'
          },
          idx === 0 ? 'Mulai dari sini' : idx === STAGES.length - 1 ? 'Tahap akhir' : 'Kosong'
        )
        : list.map((app) =>
            renderCard(app, {
              onOpen,
              onAdvance: (a) => { moveStage(a.id, +1); toast(`"${a.company}" naik ke tahap berikutnya.`); },
              onBack: (a) => { moveStage(a.id, -1); toast('Tahap diturunkan.'); },
              onDecline: (a) => confirmDialog({
                title: 'Tandai ditolak?',
                message: `Lamaran "${a.company}" akan ditandai sebagai ditolak.`,
                confirmText: 'Tandai ditolak',
                onConfirm: () => { setStage(a.id, 'rejected'); toast('Ditandai ditolak.', 'danger'); },
              }),
            })
          )
    );

    return h('section', { class: 'column' },
      h('header', { class: 'column__head' },
        h('span', {
          class: 'column__step',
          style: `color:${stage.color}; border-color:${stage.color}44;`
        },
          String(idx + 1).padStart(2, '0')
        ),
        h('span', { class: 'column__name' }, stage.label),
        h('span', { class: 'column__count tabular' }, list.length)
      ),
      drop
    );
  });

  return h('div', { class: 'board-backdrop' },
    h('div', { class: 'board' }, ...columns)
  );
}