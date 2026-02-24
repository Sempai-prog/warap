import { getDashboardMetrics } from "@/app/actions/dashboard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, ArrowRight, User } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

interface DashboardOrder {
  id: string;
  customer_name: string;
  total_amount_xaf: bigint;
  product: {
    title: string;
  };
}

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();

  if (!metrics) return <div>Chargement...</div>;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-tight text-neutral-900 leading-tight">
            Bonjour, <span className="text-primary">{metrics.firstName}</span>!
          </h1>
          <p className="text-neutral-500 font-bold mt-1">
            Voici vos performances du jour
          </p>
        </div>
        <div className="h-14 w-14 rounded-2xl bg-white shadow-soft border border-white/60 flex items-center justify-center text-primary font-black text-xl">
          <User size={28} />
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <motion.div variants={itemVariants}>
          <div className="p-6 bg-neutral-900 rounded-[2.5rem] shadow-soft-xl text-white relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-white/60 text-[10px] font-black uppercase tracking-widest mb-4">
                <TrendingUp size={14} />
                Ventes
              </div>
              <p className="text-4xl font-black leading-none">
                {Number(metrics.salesToday).toLocaleString()}
              </p>
              <p className="text-[10px] mt-2 font-bold text-white/40 uppercase tracking-tighter">
                XAF • Aujourd&apos;hui
              </p>
            </div>
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="p-6 bg-white rounded-[2.5rem] shadow-soft border border-white/60 text-neutral-900 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-neutral-400 text-[10px] font-black uppercase tracking-widest mb-4">
                <ShoppingBag size={14} />
                Commandes
              </div>
              <p className="text-4xl font-black leading-none">
                {metrics.newOrdersCount}
              </p>
              <p className="text-[10px] mt-2 font-bold text-neutral-300 uppercase tracking-tighter">
                Nouveaux arrivants
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.section variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
            Récent
          </h2>
          <Link href="/orders">
            <Button
              variant="ghost"
              className="text-sm font-black text-primary hover:bg-primary/5 rounded-2xl flex items-center gap-1"
            >
              Voir tout
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {metrics.recentOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-[2.5rem] border border-dashed border-neutral-100 text-neutral-300 font-medium italic p-8">
              Vous n&apos;avez pas encore de commandes.
              <br />
              Partagez votre boutique pour commencer !
            </div>
          ) : (
            metrics.recentOrders.map((order: DashboardOrder) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <div className="p-6 bg-white rounded-[2.5rem] border border-white/60 shadow-soft hover:shadow-soft-lg active:scale-[0.98] transition-all flex items-center gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-neutral-50 flex items-center justify-center flex-shrink-0 text-2xl shadow-sm border border-neutral-100">
                    📦
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-neutral-900 truncate">
                      {order.customer_name}
                    </p>
                    <p className="text-sm font-bold text-neutral-400 truncate mt-0.5">
                      {order.product.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-lg text-neutral-900">
                      {Number(order.total_amount_xaf).toLocaleString()}
                    </p>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      XAF
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </motion.section>
    </motion.div>
  );
}
