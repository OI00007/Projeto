import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { ExportData, downloadCSV, printPDF } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";

interface ExportButtonsProps {
  data: ExportData;
  filename: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ExportButtons({ data, filename, variant = "outline", size = "default" }: ExportButtonsProps) {
  const { toast } = useToast();

  const handleExportCSV = () => {
    try {
      downloadCSV(data, filename);
      toast({
        title: "Exportação concluída",
        description: "Arquivo CSV gerado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o arquivo CSV.",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = () => {
    try {
      printPDF(data);
      toast({
        title: "PDF gerado",
        description: "A janela de impressão foi aberta.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o PDF.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleExportCSV} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="h-4 w-4 text-success" />
          Exportar Excel (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF} className="gap-2 cursor-pointer">
          <FileText className="h-4 w-4 text-destructive" />
          Exportar PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
