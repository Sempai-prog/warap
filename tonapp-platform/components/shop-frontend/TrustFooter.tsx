import { ShieldCheck, Truck, RefreshCw } from "lucide-react";

export function TrustFooter() {
  const items = [
    {
      icon: <ShieldCheck className="text-primary-600" size={18} />,
      text: "Paiement Sécurisé",
    },
    {
      icon: <Truck className="text-primary-600" size={18} />,
      text: "Livraison Rapide",
    },
    {
      icon: <RefreshCw className="text-primary-600" size={18} />,
      text: "Garantie Satisfait",
    },
  ];

  return (
    <footer className="mt-12 py-8 bg-neutral-50 border-t border-neutral-100">
      <div className="flex justify-around px-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center gap-2 text-center"
          >
            {item.icon}
            <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">
              {item.text}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <p className="text-tiny text-neutral-300 font-medium tracking-widest">
          PROPULSÉ PAR TONAPP
        </p>
      </div>
    </footer>
  );
}
