/**
 * Página de Relatórios — gera PDFs reais com dados da fazenda.
 * Usa jsPDF instalado no projeto. Histórico salvo no localStorage.
 */
import { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DateInput } from "@/components/ui/date-input";
import { useToast } from "@/hooks/use-toast";
import { useFinancialData, useSensorData } from "@/contexts/FarmDataContext";
import { formatCurrencyBRL } from "@/lib/formatters";
import {
  formatDateBrasilia,
  getCurrentHarvestYear,
  nowBrasilia,
} from "@/lib/dateTime";
import { cn } from "@/lib/utils";
import {
  FileText,
  Download,
  BarChart3,
  TrendingUp,
  Leaf,
  DollarSign,
  Trash2,
  Loader2,
  Calendar,
} from "lucide-react";
// @ts-expect-error — jsPDF types
import jsPDF from "jspdf";

interface StoredReport {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  dataUrl: string;
}

const STORAGE_KEY = "argom_reports_v2";

function loadHistory(): StoredReport[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveHistory(reports: StoredReport[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports.slice(0, 10)));
  } catch {
    /**/
  }
}

const REPORT_TYPES = [
  {
    id: "financial",
    label: "Financeiro",
    desc: "Receitas, despesas, lucro e categorias",
    icon: DollarSign,
    fields: [
      "Receitas",
      "Despesas por categoria",
      "Margem de lucro",
      "Transações",
    ],
  },
  {
    id: "sensors",
    label: "Sensores",
    desc: "Status e leituras de todos os sensores",
    icon: BarChart3,
    fields: ["Status dos sensores", "Leituras atuais", "Alertas ativos"],
  },
  {
    id: "productivity",
    label: "Produtividade",
    desc: "Análise por safra e setor",
    icon: TrendingUp,
    fields: ["Área por cultura", "Eficiência", "Meta vs realizado"],
  },
  {
    id: "complete",
    label: "Completo",
    desc: "Todos os dados consolidados",
    icon: Leaf,
    fields: ["Financeiro", "Sensores", "Alertas", "Resumo operacional"],
  },
];

export default function Reports() {
  const { toast } = useToast();
  const { financial } = useFinancialData();
  const { sensors } = useSensorData();

  const [selectedType, setSelectedType] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [generating, setGenerating] = useState(false);
  const [history, setHistory] = useState<StoredReport[]>(loadHistory);

  const selectedReport = REPORT_TYPES.find((r) => r.id === selectedType);
  const today = nowBrasilia().toISOString().split("T")[0];

  function handleSelectType(id: string) {
    setSelectedType(id);
    const r = REPORT_TYPES.find((t) => t.id === id);
    setSelectedFields(r?.fields ?? []);
  }

  const handleGenerate = useCallback(async () => {
    if (!selectedType) {
      toast({
        title: "Selecione um tipo de relatório",
        variant: "destructive",
      });
      return;
    }
    setGenerating(true);

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();
      const M = 18;
      let y = M;

      const rpt = selectedReport!;
      const now = nowBrasilia();
      const period =
        dateStart && dateEnd
          ? `${formatDateBrasilia(dateStart)} a ${formatDateBrasilia(dateEnd)}`
          : `Até ${formatDateBrasilia(now)}`;

      // Cabeçalho verde
      doc.setFillColor(22, 101, 52);
      doc.rect(0, 0, W, 50, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("SISTEMA ARGOM", M, 15);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Relatorio Gerencial de Operacoes Rurais", M, 23);
      doc.setFontSize(9);
      doc.text(rpt.label, M, 31);
      doc.setFontSize(8);
      doc.text(`Período: ${period} | Safra ${getCurrentHarvestYear()}`, M, 39);
      y = 58;

      // Data e informações de geração
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Documento gerado em: ${formatDateBrasilia(now, { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })} (horário de Brasília)`,
        M,
        y,
      );
      y += 5;
      doc.text("Confidencial - Uso Restrito", M, y);
      y += 6;
      doc.setDrawColor(180, 180, 180);
      doc.line(M, y, W - M, y);
      y += 8;

      function section(title: string) {
        if (y > H - 30) {
          doc.addPage();
          y = M;
        }
        doc.setFillColor(22, 101, 52);
        doc.rect(M, y, W - M * 2, 9, "F");
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(title, M + 3, y + 6);
        doc.setTextColor(30, 30, 30);
        y += 13;
      }

      function row(label: string, value: string, isBold = false) {
        if (y > H - 16) {
          doc.addPage();
          y = M;
        }

        doc.setFontSize(9);
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        doc.setTextColor(isBold ? 22 : 40, isBold ? 101 : 40, isBold ? 52 : 40);

        // Quebra automática de linhas para rótulos longos
        const maxLabelWidth = (W - M * 2) * 0.55;
        const splitLabel = doc.splitTextToSize(label, maxLabelWidth);
        doc.text(splitLabel[0], M + 2, y + 4);

        doc.setFont("helvetica", isBold ? "bold" : "normal");
        doc.setTextColor(isBold ? 22 : 60, isBold ? 101 : 60, isBold ? 52 : 60);
        const maxValueWidth = (W - M * 2) * 0.4;
        const splitValue = doc.splitTextToSize(value, maxValueWidth);
        doc.text(splitValue[0], W - M - 2, y + 4, { align: "right" });

        if (!isBold) {
          doc.setDrawColor(220, 220, 220);
          doc.line(M + 1, y + 6.5, W - M - 1, y + 6.5);
        }

        y += 7;
      }

      // Filtrar transações
      const txs = financial.transactions.filter((t) => {
        if (!dateStart && !dateEnd) return true;
        const d = t.transaction_date;
        if (dateStart && d < dateStart) return false;
        if (dateEnd && d > dateEnd) return false;
        return true;
      });
      const income = txs
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0);
      const expenses = txs
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0);
      const profit = income - expenses;

      // Financeiro
      if (["financial", "complete"].includes(selectedType)) {
        section("I. SITUACAO FINANCEIRA");
        row("Receita Total Auferida", formatCurrencyBRL(income), true);
        row("Despesas Operacionais Totais", formatCurrencyBRL(expenses), false);
        row("Lucro Liquido do Período", formatCurrencyBRL(profit), true);
        row(
          "Margem de Lucro (%)",
          `${income > 0 ? ((profit / income) * 100).toFixed(1) : 0}%`,
          false,
        );
        row("Quantidade de Transacoes", `${txs.length} registros`, true);
        y += 6;

        if (txs.length > 0) {
          section("II. DETALHAMENTO DE TRANSACOES");
          row("Data", "Categoria - Descricao", true);
          txs.slice(0, 20).forEach((t, i) => {
            const desc = `${t.category}`;
            row(
              `${formatDateBrasilia(t.transaction_date)}`,
              `${t.type === "income" ? "[RECEITA] " : "[DESPESA] "}${formatCurrencyBRL(t.amount)}`,
              false,
            );
          });
          if (txs.length > 20) {
            doc.setFontSize(8);
            doc.setTextColor(120, 120, 120);
            doc.setFont("helvetica", "normal");
            doc.text(
              `Nota: Exibindo 20 de ${txs.length} transacoes. Consulte o sistema para informacoes completas.`,
              M + 2,
              y + 2,
            );
            y += 5;
          }
          y += 4;
        }
      }

      // Sensores
      if (["sensors", "complete"].includes(selectedType)) {
        section("III. MONITORAMENTO DE SENSORES");
        const online = sensors.filter((s) => s.status === "online").length;
        const warning = sensors.filter((s) => s.status === "warning").length;
        const crit = sensors.filter((s) => s.status === "critical").length;
        const offline = sensors.filter((s) => s.status === "offline").length;
        row("Sensores Online (Operacional)", `${online}`, true);
        row("Sensores em Alerta", `${warning}`, false);
        row("Sensores Criticos", `${crit}`, false);
        row("Sensores Desconectados", `${offline}`, true);
        y += 4;

        if (sensors.length > 0) {
          section("IV. LEITURA ATUAL DOS SENSORES");
          row("Identificacao", "Valor Lido", true);
          sensors.forEach((s, i) => {
            const statusIndicator =
              s.status === "online"
                ? "[OK]"
                : s.status === "warning"
                  ? "[ALERTA]"
                  : "[CRITICO]";
            row(`${statusIndicator} ${s.name}`, `${s.value} ${s.unit}`, false);
          });
        }
      }

      // Rodapé
      const pages = doc.internal.getNumberOfPages();
      for (let p = 1; p <= pages; p++) {
        doc.setPage(p);
        doc.setFontSize(7);
        doc.setTextColor(140, 140, 140);
        doc.setDrawColor(200, 200, 200);
        doc.line(M, H - 14, W - M, H - 14);
        doc.setFont("helvetica", "normal");
        doc.text(
          `Sistema Argom - Gestao Rural Inteligente | ${rpt.label} | Pagina ${p} de ${pages}`,
          W / 2,
          H - 8,
          { align: "center" },
        );
        doc.setFontSize(6);
        doc.text(
          "Copyright 2026 - Todos os direitos reservados",
          W / 2,
          H - 3,
          { align: "center" },
        );
      }

      const filename = `argom-${selectedType}-${today}.pdf`;
      doc.save(filename);

      const dataUrl = doc.output("datauristring");
      const sizeKb = Math.round((dataUrl.length * 0.75) / 1024);
      const newRpt: StoredReport = {
        id: Date.now().toString(),
        name: `${rpt.label} — ${formatDateBrasilia(now)}`,
        type: selectedType,
        date: now.toISOString(),
        size: `${sizeKb} KB`,
        dataUrl,
      };
      const updated = [newRpt, ...history];
      setHistory(updated);
      saveHistory(updated);

      toast({
        title: "✅ PDF gerado!",
        description: `${filename} baixado com sucesso.`,
      });
    } catch (err) {
      toast({
        title: "Erro ao gerar PDF",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  }, [
    selectedType,
    dateStart,
    dateEnd,
    financial,
    sensors,
    history,
    selectedReport,
    toast,
    today,
  ]);

  function redownload(r: StoredReport) {
    const a = document.createElement("a");
    a.href = r.dataUrl;
    a.download = `argom-${r.type}-${r.date.split("T")[0]}.pdf`;
    a.click();
    toast({ title: "Download iniciado", description: r.name });
  }

  function deleteReport(id: string) {
    const updated = history.filter((r) => r.id !== id);
    setHistory(updated);
    saveHistory(updated);
  }

  return (
    <DashboardLayout
      title="Relatórios"
      subtitle="Gere e baixe relatórios em PDF com dados reais"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Tipos de relatório */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Tipo de Relatório
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REPORT_TYPES.map((r) => {
                const Icon = r.icon;
                const active = selectedType === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelectType(r.id)}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all hover:shadow-sm",
                      active
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                          active ? "bg-primary/20" : "bg-muted",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5",
                            active ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                      </div>
                      <div>
                        <p
                          className={cn(
                            "font-semibold text-sm",
                            active && "text-primary",
                          )}
                        >
                          {r.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {r.desc}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {selectedReport && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Campos */}
              <div>
                <p className="text-sm font-medium mb-2">
                  Incluir no relatório:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedReport.fields.map((f) => (
                    <label
                      key={f}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedFields.includes(f)}
                        onCheckedChange={(c) =>
                          setSelectedFields((prev) =>
                            c ? [...prev, f] : prev.filter((x) => x !== f),
                          )
                        }
                      />
                      <span className="text-sm">{f}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Período */}
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Período
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">
                      Data inicial
                    </label>
                    <DateInput
                      value={dateStart}
                      max={today}
                      onChange={(e) => setDateStart(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">
                      Data final
                    </label>
                    <DateInput
                      value={dateEnd}
                      max={today}
                      onChange={(e) => setDateEnd(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full bg-primary text-primary-foreground"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Gerando PDF…
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Gerar e Baixar PDF
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Histórico */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Relatórios Gerados
              </CardTitle>
              {history.length > 0 && (
                <Badge variant="secondary">{history.length}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground border border-dashed rounded-xl">
                <FileText className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Nenhum relatório gerado ainda.</p>
                <p className="text-xs mt-1">
                  Selecione um tipo acima e clique em "Gerar PDF".
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted/20 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{r.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateBrasilia(r.date, {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}{" "}
                          · {r.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-primary"
                        onClick={() => redownload(r)}
                        title="Baixar novamente"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteReport(r.id)}
                        title="Remover"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
