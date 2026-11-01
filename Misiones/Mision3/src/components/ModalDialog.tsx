import {
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
} from 'react';

interface ModalDialogProps {
  abierto: boolean;
  tituloId: string;
  claseExtra?: string;
  ariaLabelCerrar?: string;
  onCerrar: () => void;
  children: ReactNode;
}

/**
 * Componente reutilizable para modales basados en el elemento nativo <dialog>.
 * Permanece montado en el DOM para sincronizar de forma bidireccional y legítima
 * showModal() y close() en el useEffect, garantizando accesibilidad y light-dismiss.
 */
export default function ModalDialog({
  abierto,
  tituloId,
  claseExtra = '',
  ariaLabelCerrar = 'Cerrar modal',
  onCerrar,
  children,
}: ModalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (abierto) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [abierto]);

  function manejarClickBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const dialog = dialogRef.current;
      if (!dialog || event.target !== dialog) return;

      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (isDialogContent) return;
      dialog.close();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={`anime-dialog ${claseExtra}`.trim()}
      aria-labelledby={tituloId}
      onClose={onCerrar}
      onClick={manejarClickBackdrop}
      {...({ closedby: 'any' } as Record<string, unknown>)}
    >
      <button
        type="button"
        className="modal-close-btn"
        aria-label={ariaLabelCerrar}
        onClick={onCerrar}
      >
        ✕
      </button>
      {abierto ? children : null}
    </dialog>
  );
}
