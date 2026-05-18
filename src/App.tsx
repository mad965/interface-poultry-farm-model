/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Github, BookOpen, Activity, BarChart3, Settings, Play, ChevronRight, CheckCircle2, Terminal, Layers, Clock, TrendingUp, ArrowRight, Search, Code, FunctionSquare, Variable, Download, RefreshCw, AlertCircle, FileText, HelpCircle, MessageSquare, Trash2, Plus, Info, ShieldCheck, ShieldAlert } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const mockData = [
  { time: 0, population: 1000, profit: -500, demand: 800, mass: 1.0 },
  { time: 10, population: 1200, profit: -200, demand: 850, mass: 1.5 },
  { time: 20, population: 1500, profit: 100, demand: 900, mass: 2.0 },
  { time: 30, population: 1400, profit: 400, demand: 950, mass: 2.5 },
  { time: 40, population: 1800, profit: 800, demand: 1000, mass: 3.0 },
  { time: 50, population: 2200, profit: 1500, demand: 1100, mass: 3.5 },
  { time: 60, population: 2100, profit: 2100, demand: 1200, mass: 4.0 },
];

const packageFunctions = [
  {
    name: "poultry_farm.parameters.create_default_parameters",
    description: "Génère un dictionnaire complet de paramètres par défaut pour le modèle avicole (grille, biologie, économie).",
    params: [
      { name: "h_t, h_m, h_a", type: "float", description: "Pas de discrétisation (temps, masse, âge)." },
      { name: "rho", type: "float", description: "Taux de transfert vers la population retardée." },
      { name: "competition_coeff", type: "float", description: "Coefficient κ de densité-dépendance." },
      { name: "fixed_cost, chick_cost, ...", type: "float", description: "Paramètres économiques en FCFA." }
    ],
    returns: "Dictionnaire de paramètres.",
    category: "Utility"
  },
  {
    name: "poultry_farm.continuous_model.ContinuousPoultryModel",
    description: "Classe principale implémentant la dynamique X (sain) et Y (retardé) via un schéma aux différences finies.",
    params: [
      { name: "params", type: "dict", description: "Paramètres générés par create_default_parameters." }
    ],
    returns: "Instance du modèle continu.",
    category: "Model"
  },
  {
    name: "ContinuousPoultryModel.simulate",
    description: "Exécute la simulation temporelle sur une durée fixée avec approvisionnements hebdomadaires.",
    params: [
      { name: "t_max", type: "int", description: "Nombre de jours de simulation." },
      { name: "record_every", type: "int", description: "Fréquence d'enregistrement de l'historique." }
    ],
    returns: "Historique des états (X_hist, Y_hist, profit_hist).",
    category: "Simulation"
  },
  {
    name: "poultry_farm.visualization.plot_combined_results",
    description: "Génère une figure synthèse avec 3 graphiques : populations, profit cumulé et répartition par âge.",
    params: [
      { name: "results", type: "dict", description: "Résultats de la simulation." }
    ],
    returns: "Objet Figure Matplotlib.",
    category: "Visualization"
  }
];

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <MathModels />
        <Optimization />
        <DashboardPreview />
        <SimulationPlayground />
        <GitHubImport />
        <Documentation />
        <Installation />
      </main>
      <Footer />
    </div>
  );
}

function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-950">
      <div className="relative flex flex-col items-center">
        {/* Logo Container */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-white p-4 shadow-2xl shadow-emerald-500/20 animate-in zoom-in-95 duration-700">
          <img 
            src="/logo-adm.jpeg" 
            alt="ADM Logo" 
            className="h-48 w-48 object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        
        {/* Loading Bar */}
        <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 animate-[loading_2.5s_ease-in-out_infinite]" style={{ width: '100%' }}></div>
        </div>
        
        <div className="mt-6 text-center">
          <h1 className="text-2xl font-bold tracking-tighter text-white mb-2">Poultry Farm Model</h1>
          <p className="text-sm font-mono text-emerald-400">Initialisation du modèle v1.0.0...</p>
        </div>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-950">
              <Activity size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight">Poultry Farm Model</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#playground" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Test & Simulation</a>
            <a href="#import" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Importation</a>
            <a href="#docs" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Documentation</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950 -z-10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl mb-6">
              Gestion intelligente de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">fermes avicoles</span>
            </h1>
            <p className="text-lg text-slate-400 mb-10 max-w-2xl leading-relaxed">
              Propulsez votre productivité avec <b>poultry-farm-model v1.0.0</b>. Un simulateur de pointe basé sur la dynamique bi-population (saine vs retardée) pour une précision accrue.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a href="#installation" className="flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-colors">
                <Terminal size={18} />
                Commencer
              </a>
              <a href="#docs" className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-6 py-3 text-sm font-semibold hover:bg-slate-800 transition-colors">
                <BookOpen size={18} />
                Explorer l'API
              </a>
            </div>
          </div>
          
          <div className="hidden lg:block relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full -z-10 animate-pulse"></div>
            <div className="rounded-3xl border border-slate-800 bg-white p-8 shadow-2xl shadow-emerald-500/20">
              <img 
                src="/logo-adm.jpeg" 
                alt="ADM Logo Large" 
                className="w-full h-auto object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: <Activity className="text-emerald-400" size={24} />,
      title: "Bi-Population (X, Y)",
      description: "Modélisation séparée des individus sains et retardés pour une meilleure gestion des soins."
    },
    {
      icon: <Layers className="text-cyan-400" size={24} />,
      title: "Schéma Upwind",
      description: "Résolution numérique stable des équations de transport via des méthodes aux différences finies."
    },
    {
      icon: <TrendingUp className="text-amber-400" size={24} />,
      title: "Rentabilité",
      description: "Calcul dynamique du profit net en intégrant les coûts de mortalité, d'aliment et de vente."
    }
  ];

  return (
    <section id="features" className="py-24 bg-slate-900/50 border-y border-slate-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Fonctionnalités Principales</h2>
          <p className="text-slate-400">Des outils mathématiques avancés traduits en code simple pour résoudre les problématiques d'élevage avicole au Cameroun et ailleurs.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="rounded-2xl border border-slate-800 bg-slate-950 p-8 hover:border-slate-700 transition-colors">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800">
                {f.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MathModels() {
  const [activeTab, setActiveTab] = useState<'populations' | 'economie'>('populations');

  return (
    <section id="models" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Fondements Mathématiques</h2>
          <p className="text-slate-400 max-w-2xl">Le nouveau modèle sépare la population en deux groupes (X et Y) pour mieux refléter les disparités de croissance.</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden">
          <div className="flex border-b border-slate-800">
            <button 
              onClick={() => setActiveTab('populations')}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'populations' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              Dynamique des Populations
            </button>
            <button 
              onClick={() => setActiveTab('economie')}
              className={`flex-1 py-4 text-sm font-medium transition-colors border-l border-slate-800 ${activeTab === 'economie' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              Calcul du Potentiel Économique
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'populations' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h3 className="text-lg font-semibold text-emerald-400 mb-4">Modèle Bi-Population (X, Y)</h3>
                  <div className="rounded-xl bg-slate-950 p-6 border border-slate-800 overflow-x-auto">
                    <BlockMath math="\begin{cases} \frac{\partial X}{\partial t} + \frac{\partial X}{\partial a} + g_x(a,m) \frac{\partial X}{\partial m} = -(d + s + r) X \\ \frac{\partial Y}{\partial t} + \frac{\partial Y}{\partial a} + g_y(a,m) \frac{\partial Y}{\partial m} = r X - (d + s) Y \end{cases}" />
                  </div>
                  <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-slate-400">
                    <div><InlineMath math="X" /> : Population saine</div>
                    <div><InlineMath math="Y" /> : Population retardée</div>
                    <div><InlineMath math="r" /> : Taux de transition (X → Y)</div>
                    <div><InlineMath math="g_x, g_y" /> : Fonctions de croissance</div>
                    <div><InlineMath math="a" /> : Âge du sujet</div>
                    <div><InlineMath math="m" /> : Masse du sujet</div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'economie' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-4">Évaluation Économique</h3>
                  <p className="text-sm text-slate-400 mb-4">Le profit cumulé dépend de la masse marchande et des coûts d'exploitation.</p>
                  <div className="rounded-xl bg-slate-950 p-6 border border-slate-800 overflow-x-auto">
                    <BlockMath math="\text{Profit} = \sum_{t} \left( \text{Prix}(m) \cdot S(t) - \text{Coût}(t) \right)" />
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-slate-400">
                    <p>Le modèle intègre les coûts de mortalité et de maintenance fixe hebdomadaire.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Optimization() {
  return (
    <section className="py-24 bg-slate-900/50 border-y border-slate-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Stratégies d'Optimisation</h2>
          <p className="text-slate-400">Le package permet de simuler des scénarios critiques et d'ajuster les leviers de croissance.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <span className="font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold">Réduction du Taux de Retard</h3>
            </div>
            <p className="text-slate-400 text-sm mb-6">
              Ajuster les soins pour minimiser le taux de transition <InlineMath math="r" /> de la population saine vers la population retardée.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
                <span className="font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold">Synchronisation des Ventes</h3>
            </div>
            <p className="text-slate-400 text-sm mb-6">
              Optimiser le paramètre <InlineMath math="s" /> pour libérer les places précisément lors des arrivages hebdomadaires.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  const previewData = [
    { name: 'S0', X: 1000, Y: 0 },
    { name: 'S1', X: 950, Y: 30 },
    { name: 'S2', X: 1020, Y: 60 },
    { name: 'S3', X: 1100, Y: 100 },
    { name: 'S4', X: 1050, Y: 150 },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Analyse de la dynamique bi-population</h2>
          <p className="text-slate-400">Le modèle permet de visualiser l'impact des retards de croissance sur la population totale.</p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-8 shadow-inner">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={previewData}>
                <defs>
                  <linearGradient id="colorX" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                <Area type="monotone" dataKey="X" stroke="#10b981" fill="url(#colorX)" name="Sain (X)" />
                <Area type="monotone" dataKey="Y" stroke="#f59e0b" fill="url(#colorY)" name="Retardé (Y)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

function GridHeatmap({ title, data, params, color }: { title: string, data?: number[][], params: any, color: string }) {
  if (!data || data.length === 0) return (
    <div className="flex flex-col items-center justify-center h-64 bg-slate-900/30 rounded-xl border border-dashed border-slate-800 text-slate-600">
      <Info size={24} className="mb-2" />
      <span className="text-xs">Lancez une simulation pour voir la distribution</span>
    </div>
  );

  const maxVal = Math.max(...data.flatMap(row => row), 1);
  const colorClass = color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500';
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</h5>
        <span className="text-[10px] font-mono text-slate-400">Max: {Math.round(maxVal)} units</span>
      </div>
      
      <div className="relative group grayscale hover:grayscale-0 transition-all duration-500">
        <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950 p-1">
          <div className="grid gap-[1px]" style={{ gridTemplateColumns: `repeat(${data[0].length}, minmax(0, 1fr))` }}>
            {data.map((row, i) => 
              row.map((val, j) => (
                <div 
                  key={`${i}-${j}`} 
                  className={`h-2 min-w-[4px] rounded-[1px] transition-colors border border-white/5 ${colorClass}`}
                  style={{ opacity: val > 0 ? 0.2 + (val / maxVal) * 0.8 : 0.05 }}
                  title={`Âge: ${(i * params.h_a).toFixed(1)}j, Masse: ${(j * params.h_m).toFixed(2)}kg, Pop: ${Math.round(val)}`}
                />
              ))
            )}
          </div>
        </div>
        
        {/* Axis Labels */}
        <div className="mt-2 flex justify-between text-[8px] font-mono text-slate-500 uppercase">
          <span>0kg</span>
          <span>Masse (kg)</span>
          <span>{params.m_max}kg</span>
        </div>
      </div>
    </div>
  );
}

function SimulationPlayground() {
  const [params, setParams] = useState({
    age_max: 45,
    m_max: 3.0,
    h_a: 1.0,
    h_m: 0.2,
    h_t: 0.05,
    rho: 0.007, // ~0.05 / 7
    competition_coeff: 0.00015,
    age_s: 30.0,
    m_s: 1.5,
    fixed_cost: 93700, // (1000/7)*655.96
    chick_cost: 1312, // 2*655.96
    feed_cost: 500, // Daily feed cost per chicken approx
    death_cost: 656, // 1*655.96
    sale_price: 5500, // Total price per chicken sold
    demand: 28.5, // 200/7
    initial_chicks: 100,
    supply_weekly: 100,
    horizon: 45,
  });

  const [simulationData, setSimulationData] = useState<any[]>([]);
  const [selectedStep, setSelectedStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const chartRef = useRef<HTMLDivElement>(null);

  const tutorialSteps = [
    { title: "Bienvenue !", content: "Ce tutoriel va vous guider à travers l'espace de simulation du modèle avicole v1.0.0.", target: "playground" },
    { title: "Population Initiale", content: "Définissez le stock de départ de votre ferme (Initial Chicks).", target: "initial_chicks" },
    { title: "Grille & Stabilité", content: "Les pas h_t, h_a et h_m doivent respecter la condition CFL (Courant-Friedrichs-Lewy) pour garantir la stabilité numérique des résultats.", target: "h_params" },
    { title: "Taux de Retard", content: "Ajustez 'rho' pour simuler la proportion de sujets qui dérivent vers la population retardée.", target: "rho" },
    { title: "Coûts de gestion", content: "Ajustez les prix pour voir l'impact sur votre rentabilité.", target: "economy" },
    { title: "Simulation", content: "Lancez le calcul pour voir les projections de rentabilité sur l'horizon choisi.", target: "run" }
  ];

  // Update mock data on mount to match new structure
  useEffect(() => {
    runSimulation();
  }, []);

  const runSimulation = () => {
    setIsSimulating(true);
    
    setTimeout(() => {
      const n_a = Math.floor(params.age_max / params.h_a) + 1;
      const n_m = Math.floor(params.m_max / params.h_m) + 1;
      
      const newData = [];
      let currentProfit = -(params.initial_chicks * params.chick_cost);
      
      // We track cohorts: {popX, popY, age, massX, massY}
      let cohorts: any[] = [];
      if (params.initial_chicks > 0) {
        cohorts.push({ popX: params.initial_chicks, popY: 0, age: 0, massX: 0.2, massY: 0.2 });
      }

      const d_base = 0.0005;
      const gamma1 = 0.08; // Base growth rate for healthy
      const gamma2 = 0.04; // Base growth rate for delayed
      
      for (let t = 0; t <= params.horizon; t += 1) {
        const supply = (t > 0 && t % 7 === 0) ? params.supply_weekly : 0;
        if (supply > 0) {
          cohorts.push({ popX: supply, popY: 0, age: 0, massX: 0.2, massY: 0.2 });
        }

        // Initialize grid
        const gridX = Array(n_a).fill(0).map(() => Array(n_m).fill(0));
        const gridY = Array(n_a).fill(0).map(() => Array(n_m).fill(0));
        
        let totalX = 0;
        let totalY = 0;
        let stepSales = 0;
        let stepFeedCosts = 0;

        // Update cohorts
        cohorts = cohorts.map(c => {
          // Sales
          let soldX = 0;
          let soldY = 0;
          if (c.age >= params.age_s && c.massX >= params.m_s) {
            soldX = c.popX * 0.1;
          }
          if (c.age >= params.age_s && c.massY >= params.m_s) {
            soldY = c.popY * 0.05;
          }

          stepSales += (soldX + soldY) * params.sale_price;

          // Transfer and Mortality
          const transfer = c.popX * params.rho;
          const deathX = c.popX * d_base;
          const deathY = c.popY * d_base;

          const newPopX = Math.max(0, c.popX - soldX - transfer - deathX);
          const newPopY = Math.max(0, c.popY - soldY + transfer - deathY);

          // Growth
          const growthX = gamma1 * (1 - c.massX / params.m_max);
          const growthY = gamma2 * (1 - c.massY / params.m_max);

          // Update grid
          const ageIdx = Math.min(n_a - 1, Math.floor(c.age / params.h_a));
          const massIdxX = Math.min(n_m - 1, Math.floor(c.massX / params.h_m));
          const massIdxY = Math.min(n_m - 1, Math.floor(c.massY / params.h_m));

          gridX[ageIdx][massIdxX] += newPopX;
          gridY[ageIdx][massIdxY] += newPopY;

          totalX += newPopX;
          totalY += newPopY;
          stepFeedCosts += (newPopX + newPopY) * params.feed_cost;

          return {
            ...c,
            popX: newPopX,
            popY: newPopY,
            age: c.age + 1,
            massX: Math.min(params.m_max, c.massX + growthX),
            massY: Math.min(params.m_max, c.massY + growthY)
          };
        }).filter(c => (c.popX + c.popY) > 0.1 && c.age <= params.age_max);

        const costs = params.fixed_cost + stepFeedCosts + (supply * params.chick_cost);
        currentProfit = currentProfit + stepSales - costs;

        newData.push({
          time: t,
          population_X: Math.round(totalX),
          population_Y: Math.round(totalY),
          total_pop: Math.round(totalX + totalY),
          profit: Math.round(currentProfit),
          gridX,
          gridY
        });
      }
      
      setSimulationData(newData);
      setSelectedStep(0);
      setIsSimulating(false);
    }, 800);
  };

  const saveScenario = () => {
    const name = `Scénario ${scenarios.length + 1} (ρ=${params.rho.toFixed(3)})`;
    setScenarios([...scenarios, { name, data: simulationData, params: { ...params } }]);
  };

  const deleteScenario = (index: number) => {
    setScenarios(scenarios.filter((_, i) => i !== index));
  };

  const exportToPDF = async () => {
    if (!chartRef.current) return;
    
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    pdf.setFontSize(20);
    pdf.text('Rapport de Simulation Poultry Farm', 20, 20);
    
    pdf.setFontSize(12);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
    pdf.text(`Paramètres: age_s=${params.age_s}, m_s=${params.m_s}, rho=${params.rho}`, 20, 40);
    pdf.text(`Population Initiale: ${params.initial_chicks}, Approvisionnement Hebdo: ${params.supply_weekly}`, 20, 50);
    
    pdf.addImage(imgData, 'PNG', 10, 60, 190, 100);
    
    const lastData = simulationData[simulationData.length - 1];
    pdf.text('Résultats Finaux:', 20, 170);
    pdf.text(`- Population Totale: ${lastData.total_pop}`, 30, 180);
    pdf.text(`- Population Saine (X): ${lastData.population_X}`, 30, 190);
    pdf.text(`- Population Retardée (Y): ${lastData.population_Y}`, 30, 200);
    pdf.text(`- Profit: ${lastData.profit} FCFA`, 30, 210);
    
    pdf.save(`rapport-simulation-${Date.now()}.pdf`);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackStatus('sending');
    setTimeout(() => {
      setFeedbackStatus('success');
      setFeedback('');
      setTimeout(() => setFeedbackStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <section id="playground" className="py-24 bg-slate-900/30 relative">
      {showTutorial && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full rounded-2xl border border-emerald-500/30 bg-slate-900 p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-emerald-400">{tutorialSteps[tutorialStep].title}</h3>
              <span className="text-xs font-mono text-slate-500">{tutorialStep + 1} / {tutorialSteps.length}</span>
            </div>
            <p className="text-slate-300 mb-8 leading-relaxed">{tutorialSteps[tutorialStep].content}</p>
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setShowTutorial(false)}
                className="text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors"
              >
                Passer
              </button>
              <div className="flex gap-3">
                {tutorialStep > 0 && (
                  <button 
                    onClick={() => setTutorialStep(tutorialStep - 1)}
                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800 transition-colors"
                  >
                    Précédent
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (tutorialStep < tutorialSteps.length - 1) {
                      setTutorialStep(tutorialStep + 1);
                    } else {
                      setShowTutorial(false);
                      setTutorialStep(0);
                    }
                  }}
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
                >
                  {tutorialStep < tutorialSteps.length - 1 ? "Suivant" : "Terminer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Espace de Test & Simulation</h2>
            <p className="text-slate-400">Ajustez les paramètres du modèle <strong>avicdyn</strong> et observez l'impact sur la dynamique de la ferme.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setShowTutorial(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              <HelpCircle size={18} className="text-emerald-400" />
              Tutoriel
            </button>
            <button 
              onClick={exportToPDF}
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              <FileText size={18} className="text-cyan-400" />
              Exporter PDF
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Settings size={18} className="text-emerald-400" />
              Paramètres d'entrée
            </h3>
            
            <div className="space-y-6">
              {/* Grille Section */}
              <div id="h_params" className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                  <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Grille & Discrétisation</h4>
                  <div className={`flex items-center gap-1 text-[10px] font-bold ${params.h_t <= params.h_a && (params.h_t * 0.1) <= params.h_m ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {params.h_t <= params.h_a && (params.h_t * 0.1) <= params.h_m ? (
                      <><ShieldCheck size={10} /> CFL OK</>
                    ) : (
                      <><ShieldAlert size={10} /> CFL Erreur</>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Âge Max (jours)</label>
                    <input type="number" className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs" value={params.age_max} onChange={(e) => setParams({...params, age_max: parseFloat(e.target.value) || 0})} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Masse Max (kg)</label>
                    <input type="number" step="0.1" className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs" value={params.m_max} onChange={(e) => setParams({...params, m_max: parseFloat(e.target.value) || 0})} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[9px] text-slate-500 mb-1">Pas Temps (h_t)</label>
                    <input type="number" step="0.01" className={`w-full bg-slate-900 border rounded px-2 py-1 text-xs ${params.h_t <= params.h_a ? 'border-slate-800' : 'border-rose-500/50 text-rose-400'}`} value={params.h_t} onChange={(e) => setParams({...params, h_t: parseFloat(e.target.value) || 0})} />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 mb-1">Pas Âge (h_a)</label>
                    <input type="number" step="0.1" className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs" value={params.h_a} onChange={(e) => setParams({...params, h_a: parseFloat(e.target.value) || 0})} />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 mb-1">Pas Masse (h_m)</label>
                    <input type="number" step="0.05" className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs" value={params.h_m} onChange={(e) => setParams({...params, h_m: parseFloat(e.target.value) || 0})} />
                  </div>
                </div>
              </div>

              {/* Biologie Section */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest border-b border-slate-800 pb-1">Biologie & Croissance</h4>
                <div id="rho">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
                    Taux de retard (ρ)
                  </label>
                  <input 
                    type="range" min="0" max="0.05" step="0.001" 
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    value={params.rho}
                    onChange={(e) => setParams({...params, rho: parseFloat(e.target.value) || 0})}
                  />
                  <div className="text-right text-xs mt-1 font-mono text-amber-400">{params.rho.toFixed(3)}</div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Compétition (κ)</label>
                  <input 
                    type="range" min="0" max="0.001" step="0.00001" 
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    value={params.competition_coeff}
                    onChange={(e) => setParams({...params, competition_coeff: parseFloat(e.target.value) || 0})}
                  />
                  <div className="text-right text-xs mt-1 font-mono text-rose-400">{params.competition_coeff.toFixed(5)}</div>
                </div>
              </div>

              {/* Gestion Section */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest border-b border-slate-800 pb-1">Gestion & Vente</h4>
                <div id="initial_chicks">
                  <label className="block text-xs text-slate-400 mb-2">Poussins initiaux</label>
                  <input type="number" className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm" value={params.initial_chicks} onChange={(e) => setParams({...params, initial_chicks: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Seuil Âge (j)</label>
                    <input type="number" className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs" value={params.age_s} onChange={(e) => setParams({...params, age_s: parseFloat(e.target.value) || 0})} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Seuil Masse (kg)</label>
                    <input type="number" step="0.1" className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs" value={params.m_s} onChange={(e) => setParams({...params, m_s: parseFloat(e.target.value) || 0})} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Arrivage Hebdo.</label>
                  <input type="number" className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm" value={params.supply_weekly} onChange={(e) => setParams({...params, supply_weekly: parseFloat(e.target.value) || 0})} />
                </div>
              </div>

              {/* Economie Section */}
              <div id="economy" className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest border-b border-slate-800 pb-1">Économie (FCFA)</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Prix Poussin</label>
                    <input type="number" className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs" value={params.chick_cost} onChange={(e) => setParams({...params, chick_cost: parseFloat(e.target.value) || 0})} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Prix de Vente</label>
                    <input type="number" className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs" value={params.sale_price} onChange={(e) => setParams({...params, sale_price: parseFloat(e.target.value) || 0})} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2">Horizon de simulation (jours)</label>
                <input type="number" className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-emerald-400" value={params.horizon} onChange={(e) => setParams({...params, horizon: parseFloat(e.target.value) || 0})} />
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                id="run"
                onClick={runSimulation}
                disabled={isSimulating}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-all disabled:opacity-50"
              >
                {isSimulating ? <RefreshCw size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
                Simuler
              </button>
              <button 
                onClick={saveScenario}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 transition-colors"
                title="Sauvegarder ce scénario"
              >
                <Plus size={20} />
              </button>
            </div>

            {scenarios.length > 0 && (
              <div className="pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Scénarios sauvegardés</h4>
                  <button 
                    onClick={() => setIsComparisonMode(!isComparisonMode)}
                    className={`text-xs font-bold px-2 py-1 rounded ${isComparisonMode ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                  >
                    Mode Comparaison
                  </button>
                </div>
                <div className="space-y-2">
                  {scenarios.map((s, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-slate-900/50 border border-slate-800 px-3 py-2 text-xs">
                      <span className="truncate max-w-[150px]">{s.name}</span>
                      <button onClick={() => deleteScenario(i)} className="text-rose-500 hover:text-rose-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Chart */}
          <div className="lg:col-span-2 space-y-8">
            <div ref={chartRef} className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {isComparisonMode ? "Comparaison des scénarios" : "Résultats de la simulation"}
                </h3>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    <span className="text-slate-400">Sain (X)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                    <span className="text-slate-400">Retardé (Y)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
                    <span className="text-slate-400">Profit</span>
                  </div>
                </div>
              </div>

              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simulationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" stroke="#64748b" tick={{fill: '#64748b'}} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="#64748b" tick={{fill: '#64748b'}} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" tick={{fill: '#64748b'}} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem', color: '#f8fafc' }}
                      itemStyle={{ color: '#f8fafc' }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="population_X" stroke="#10b981" strokeWidth={3} dot={false} name="Sain (X)" />
                    <Line yAxisId="left" type="monotone" dataKey="population_Y" stroke="#f59e0b" strokeWidth={3} dot={false} name="Retardé (Y)" />
                    <Line yAxisId="right" type="monotone" dataKey="profit" stroke="#06b6d4" strokeWidth={2} dot={false} name="Profit" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-slate-900/50 p-4 border border-slate-800">
                  <span className="text-xs text-slate-500 uppercase block mb-1">Pop. Totale</span>
                  <span className="text-xl font-bold text-emerald-400">{simulationData.length > 0 ? simulationData[simulationData.length - 1].total_pop : 0}</span>
                </div>
                <div className="rounded-xl bg-slate-900/50 p-4 border border-slate-800">
                  <span className="text-xs text-slate-500 uppercase block mb-1">Profit Final</span>
                  <span className="text-xl font-bold text-cyan-400">{simulationData.length > 0 ? simulationData[simulationData.length - 1].profit : 0} FCFA</span>
                </div>
                <div className="rounded-xl bg-slate-900/50 p-4 border border-slate-800">
                  <span className="text-xs text-slate-500 uppercase block mb-1">Taux de Retard</span>
                  <span className="text-xl font-bold text-amber-400">{simulationData.length > 0 && simulationData[simulationData.length - 1].total_pop > 0 ? Math.round((simulationData[simulationData.length - 1].population_Y / simulationData[simulationData.length - 1].total_pop) * 100) : 0}%</span>
                </div>
              </div>
            </div>

            {/* Grid Visualization Section */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="text-emerald-400" size={18} />
                  <h3 className="text-lg font-semibold">Distribution Spatiale (Âge x Masse)</h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-slate-400 font-mono bg-slate-900 border border-slate-800 px-2 py-1 rounded">
                    Temps : <span className="text-emerald-400">{simulationData[selectedStep]?.time || 0}</span> jours
                  </div>
                  <button onClick={exportToPDF} className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-[10px] font-bold text-slate-300 hover:bg-slate-700 transition-colors">
                    <Download size={14} /> PDF
                  </button>
                </div>
              </div>
              
              <div className="mb-8 px-2">
                <div className="flex justify-between text-[10px] text-slate-500 mb-2 uppercase tracking-widest font-bold">
                  <span>t = 0</span>
                  <span>Sélectionner l'instant t_k</span>
                  <span>t = {params.horizon}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max={simulationData.length > 0 ? simulationData.length - 1 : 0} 
                  value={selectedStep}
                  onChange={(e) => setSelectedStep(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <GridHeatmap 
                  title="Population Saine (X)" 
                  data={simulationData[selectedStep]?.gridX} 
                  params={params} 
                  color="emerald" 
                />
                <GridHeatmap 
                  title="Population Retardée (Y)" 
                  data={simulationData[selectedStep]?.gridY} 
                  params={params} 
                  color="amber" 
                />
              </div>

              <div className="mt-8 flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800/50">
                <Info size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-tight">
                  <p>
                    Chaque pixel représente une fraction de la population dans la grille (âge, masse). 
                    L'axe horizontal représente la <strong>masse (0 à {params.m_max} kg)</strong>, 
                    tandis que les lignes représentent les <strong>cohortes par âge</strong>. 
                    L'intensité de la couleur est proportionnelle à la densité de population.
                  </p>
                </div>
              </div>
            </div>

            {/* Feedback System */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="text-emerald-400" size={24} />
                <h3 className="text-xl font-bold">Améliorer les modèles</h3>
              </div>
              <p className="text-slate-400 text-sm mb-6">
                Vos retours sont essentiels pour affiner nos algorithmes. Avez-vous remarqué des incohérences ou souhaitez-vous une nouvelle fonctionnalité ?
              </p>
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <textarea 
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm focus:border-emerald-500 focus:outline-none transition-colors min-h-[100px]"
                  placeholder="Votre message..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                />
                <button 
                  type="submit"
                  disabled={feedbackStatus !== 'idle'}
                  className="rounded-xl bg-white px-6 py-2 text-sm font-bold text-slate-950 hover:bg-slate-200 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {feedbackStatus === 'sending' ? <RefreshCw size={16} className="animate-spin" /> : <ChevronRight size={16} />}
                  {feedbackStatus === 'success' ? "Merci pour votre retour !" : "Envoyer le feedback"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GitHubImport() {
  const [repoUrl, setRepoUrl] = useState('https://github.com/mad965/poultry-farm-model');
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleImport = () => {
    setIsImporting(true);
    setImportStatus('idle');
    
    // Simulate import process
    setTimeout(() => {
      if (repoUrl.includes('github.com')) {
        setImportStatus('success');
      } else {
        setImportStatus('error');
      }
      setIsImporting(false);
    }, 1500);
  };

  return (
    <section id="import" className="py-24 border-y border-slate-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 mb-6">
            <Download size={32} className="text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Importer depuis GitHub</h2>
          <p className="text-slate-400 mb-10">
            Connectez votre dépôt GitHub pour importer directement votre implémentation personnalisée du modèle. 
            Supporte la structure <strong>poultry-farm-model v1.0.0</strong> (X/Y populations).
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="URL du dépôt GitHub..." 
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-10 py-3 text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
              />
            </div>
            <button 
              onClick={handleImport}
              disabled={isImporting}
              className="rounded-xl bg-white px-8 py-3 text-sm font-bold text-slate-950 hover:bg-slate-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isImporting ? <RefreshCw size={18} className="animate-spin" /> : <ChevronRight size={18} />}
              {isImporting ? "Importation..." : "Importer"}
            </button>
          </div>

          {importStatus === 'success' && (
            <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm text-emerald-400">
                <CheckCircle2 size={16} />
                Package importé avec succès !
              </div>
            </div>
          )}

          {importStatus === 'error' && (
            <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="inline-flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/20 px-4 py-2 text-sm text-rose-400">
                <AlertCircle size={16} />
                Erreur : URL de dépôt invalide.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Documentation() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredFunctions = useMemo(() => {
    return packageFunctions.filter(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <section id="docs" className="py-24 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Documentation de l'API</h2>
          <p className="text-slate-400 max-w-2xl mb-8">Référence complète des fonctions disponibles dans le package avian-dynamics.</p>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher une fonction..." 
              className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6">
          {filteredFunctions.length > 0 ? (
            filteredFunctions.map((f, i) => (
              <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 hover:border-slate-700 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-emerald-400">
                      <Code size={16} />
                    </div>
                    <h3 className="text-lg font-mono font-bold text-emerald-400">{f.name}</h3>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400 border border-slate-700">
                    {f.category}
                  </span>
                </div>
                
                <p className="text-slate-300 mb-6 leading-relaxed">{f.description}</p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                      <Variable size={12} />
                      Paramètres
                    </h4>
                    <div className="space-y-3">
                      {f.params.map((p, pi) => (
                        <div key={pi} className="flex items-start gap-3">
                          <code className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded">{p.name}</code>
                          <div className="text-xs">
                            <span className="text-slate-500 italic mr-2">({p.type})</span>
                            <span className="text-slate-400">{p.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                      <FunctionSquare size={12} />
                      Valeur de retour
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {f.returns}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center rounded-2xl border border-dashed border-slate-800">
              <p className="text-slate-500">Aucune fonction ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Installation() {
  return (
    <section id="installation" className="py-24 bg-slate-900/50 border-t border-slate-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-6">Prêt à optimiser votre élevage ?</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Installez le package via pip et commencez à modéliser la dynamique de votre ferme avicole en quelques lignes de code. 
              La documentation complète inclut des tutoriels détaillés et des exemples de notebooks Jupyter.
            </p>
            <ul className="space-y-4 mb-8">
              {['Compatible Python 3.8+', 'Support NumPy et SciPy', 'Visualisations avec Matplotlib intégrées', 'Solveurs d\'optimisation inclus'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a href="https://github.com/mad965/avicdyn" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-200 transition-colors">
              <Github size={18} />
              Voir le code source
            </a>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-rose-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <span className="ml-2 text-xs font-medium text-slate-500 font-mono">terminal</span>
            </div>
            <div className="p-6 font-mono text-sm">
              <div className="mb-6">
                <span className="text-emerald-400">$</span> <span className="text-slate-300">pip install poultry-farm-model</span>
              </div>
              <div className="text-slate-400 mb-2"># Utilisation du nouveau modèle bi-population</div>
              <div className="text-pink-400">from <span className="text-slate-300">poultry_farm.parameters</span> import <span className="text-cyan-300">create_default_parameters</span></div>
              <div className="text-pink-400">from <span className="text-slate-300">poultry_farm.continuous_model</span> import <span className="text-cyan-300">ContinuousPoultryModel</span></div>
              <br />
              <div className="text-slate-300">params = create_default_parameters()</div>
              <div className="text-slate-300">model = ContinuousPoultryModel(params)</div>
              <div className="text-slate-300">results = model.simulate(t_max=<span className="text-amber-300">45</span>)</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Activity className="text-emerald-500" size={24} />
          <span className="text-xl font-bold tracking-tight">Poultry Farm Model</span>
        </div>
        <p className="text-sm text-slate-500">
          Basé sur les travaux de recherche de l'Université de Bertoua.
        </p>
        <div className="flex gap-4">
          <a href="https://github.com/mad965/poultry-farm-model" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors">
            <Github size={20} />
          </a>
          <a href="#" className="text-slate-500 hover:text-white transition-colors">
            <BookOpen size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}

