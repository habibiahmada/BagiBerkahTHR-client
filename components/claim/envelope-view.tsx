"use client";

interface EnvelopeViewProps {
  recipientName: string;
  envelopeOpened: boolean;
  onOpen: () => void;
}

export function EnvelopeView({
  recipientName,
  envelopeOpened,
  onOpen,
}: EnvelopeViewProps) {
  return (
    <div className="text-center space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          THR untuk {recipientName}
        </h1>
        <p className="text-muted-foreground">
          Ada amplop THR untukmu! Tap untuk membuka
        </p>
      </div>

      <div
        className={`relative mx-auto w-64 h-80 cursor-pointer transition-transform duration-500 ${
          envelopeOpened ? "scale-110 rotate-6" : "hover:scale-105"
        }`}
        onClick={onOpen}
      >
        <div className="absolute inset-0 bg-gradient-hero rounded-3xl shadow-elevated flex items-center justify-center">
          <div className="text-primary-foreground text-center">
            <div className="text-6xl mb-4">✉️</div>
            <p className="text-xl font-semibold">Tap untuk buka</p>
          </div>
        </div>
      </div>

      {!envelopeOpened && (
        <p className="text-sm text-muted-foreground">
          Ketuk amplop untuk membukanya
        </p>
      )}
    </div>
  );
}
