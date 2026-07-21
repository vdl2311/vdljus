import React, { useState } from "react";
import { useJusFlow } from "../../store/JusFlowContext";
import {
  Search,
  Library,
  Bookmark,
  ArrowUpRight,
  FolderHeart,
} from "lucide-react";
export const ConhecimentoView: React.FC = () => {
  const { articles } = useJusFlow();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const filtered = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.summary.toLowerCase().includes(search.toLowerCase()) ||
      art.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      selectedCategory === "All" || art.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-background transition-colors">
      {" "}
      {/* Header */}{" "}
      <div className="text-left">
        {" "}
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Base de Conhecimento
        </h2>{" "}
        <p className="text-xs text-muted-foreground">
          Consulte a biblioteca interna do escritório com súmulas, acórdãos
          paradigmas e julgados favoráveis.
        </p>{" "}
      </div>{" "}
      {/* Query Filter and Search bar */}{" "}
      <div className="p-4 bg-card border border-border rounded-xl shadow-sm flex flex-col md:flex-row gap-3">
        {" "}
        {/* Search */}{" "}
        <div className="flex-1 relative">
          {" "}
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />{" "}
          <input
            type="text"
            placeholder="Pesquisar súmulas, acórdãos, jurisprudência..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border focus:border-emerald-500 rounded-md pl-9 pr-4 py-2 text-xs text-card-foreground focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:outline-none transition-all"
          />{" "}
        </div>{" "}
        {/* Quick categories */}{" "}
        <div className="flex gap-1 overflow-x-auto no-scrollbar shrink-0">
          {" "}
          {[
            { id: "All", label: "Todas" },
            { id: "súmula", label: "Súmulas" },
            { id: "acórdão", label: "Acórdãos" },
            { id: "artigo", label: "Artigos" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${selectedCategory === cat.id ? "bg-card text-white dark:bg-muted" : "text-muted-foreground hover:bg-slate-200/50 dark:hover:bg-accent hover:text-accent-foreground/40"}`}
            >
              {" "}
              {cat.label}{" "}
            </button>
          ))}{" "}
        </div>{" "}
      </div>{" "}
      {/* Grid List */}{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {" "}
        {filtered.map((art) => (
          <div
            key={art.id}
            className="p-5 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between hover:border-emerald-500/30 transition-all group relative"
          >
            {" "}
            <div className="space-y-3">
              {" "}
              {/* Card top bar */}{" "}
              <div className="flex justify-between items-center">
                {" "}
                <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded">
                  {" "}
                  {art.category}{" "}
                </span>{" "}
                <Bookmark className="w-4 h-4 text-muted-foreground hover:text-emerald-500 transition-colors cursor-pointer shrink-0" />{" "}
              </div>{" "}
              {/* Title & reference code */}{" "}
              <div className="space-y-1">
                {" "}
                <h3 className="text-xs sm:text-sm font-bold text-card-foreground line-clamp-1 group-hover:text-emerald-500 transition-colors">
                  {" "}
                  {art.title}{" "}
                </h3>{" "}
                {art.referenceCode && (
                  <span className="text-xs font-mono font-bold text-muted-foreground block">
                    {art.referenceCode}
                  </span>
                )}{" "}
              </div>{" "}
              {/* Summary */}{" "}
              <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                {" "}
                {art.summary}{" "}
              </p>{" "}
            </div>{" "}
            {/* Tags and read link */}{" "}
            <div className="mt-5 border-t border-border pt-3 flex flex-wrap gap-1.5 items-center justify-between">
              {" "}
              <div className="flex flex-wrap gap-1">
                {" "}
                {art.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm"
                  >
                    {" "}
                    #{tag}{" "}
                  </span>
                ))}{" "}
              </div>{" "}
              <button className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 hover:underline cursor-pointer">
                {" "}
                Ver Completo <ArrowUpRight className="w-3.5 h-3.5" />{" "}
              </button>{" "}
            </div>{" "}
          </div>
        ))}{" "}
        {filtered.length === 0 && (
          <div className="col-span-full p-12 bg-card border border-border rounded-xl text-center text-xs text-muted-foreground">
            {" "}
            Nenhuma matéria ou artigo jurisprudencial localizado para esses
            termos.{" "}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
};
