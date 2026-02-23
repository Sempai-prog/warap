import { Button } from "@/components/ui/button";

export default function ShopFrontOffice() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="relative px-6 pt-12">
        <div className="space-y-4">
          <h2 className="text-h1 font-black bg-gradient-to-r from-neutral-900 via-primary-800 to-primary-600 bg-clip-text text-transparent leading-tight">
            Nouveautés pour vous.
          </h2>
          <p className="text-large text-neutral-500 max-w-[80%] leading-relaxed">
            Découvrez notre collection exclusive et profitez d&apos;offres
            exceptionnelles.
          </p>
          <div className="pt-4">
            <Button className="rounded-full bg-primary-600 hover:bg-primary-700 text-white px-8 h-12 text-base font-bold shadow-xl shadow-primary-600/20 transition-all active:scale-95">
              Explorer maintenant
            </Button>
          </div>
        </div>
      </section>

      <section className="px-6 space-y-6">
        <h3 className="text-xl font-bold text-neutral-900">
          Articles en vedette
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
          {[1, 2, 4, 5].map((i) => (
            <div key={i} className="group space-y-3 cursor-pointer">
              <div className="aspect-[4/5] rounded-[2rem] bg-neutral-100 overflow-hidden relative border border-neutral-100/50 shadow-sm transition-transform group-hover:scale-[0.98]">
                <div className="absolute top-4 right-4">
                  <div className="h-8 w-8 rounded-full bg-white/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-primary-600">
                    <span className="text-xs font-bold">+</span>
                  </div>
                </div>
              </div>
              <div className="px-2">
                <p className="text-small font-bold text-neutral-900 line-clamp-1">
                  Article de Luxe #{i}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-base font-black text-primary-600">
                    25,000 <span className="text-tiny">XAF</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
