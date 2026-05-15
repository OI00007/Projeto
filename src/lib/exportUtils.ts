// Export utilities for PDF and Excel

export interface ExportData {
  title: string;
  subtitle?: string;
  columns: { header: string; key: string; width?: number }[];
  data: Record<string, unknown>[];
  summary?: { label: string; value: string }[];
}

// Generate CSV content (Excel compatible)
export function generateCSV(exportData: ExportData): string {
  const { columns, data, title, summary } = exportData;
  
  let csv = "";
  
  // Add title
  csv += `"${title}"\n`;
  if (exportData.subtitle) {
    csv += `"${exportData.subtitle}"\n`;
  }
  csv += `"Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}"\n`;
  csv += "\n";
  
  // Add headers
  csv += columns.map(col => `"${col.header}"`).join(",") + "\n";
  
  // Add data rows
  data.forEach(row => {
    csv += columns.map(col => {
      const value = row[col.key];
      if (value === null || value === undefined) return '""';
      if (typeof value === 'number') return value.toString();
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(",") + "\n";
  });
  
  // Add summary if provided
  if (summary && summary.length > 0) {
    csv += "\n";
    csv += '"Resumo"\n';
    summary.forEach(item => {
      csv += `"${item.label}","${item.value}"\n`;
    });
  }
  
  return csv;
}

// Download CSV file
export function downloadCSV(exportData: ExportData, filename: string): void {
  const csv = generateCSV(exportData);
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Generate HTML for PDF printing
export function generatePDFHTML(exportData: ExportData): string {
  const { title, subtitle, columns, data, summary } = exportData;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          color: #1a1a1a;
          line-height: 1.5;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #22c55e;
        }
        .header h1 { 
          color: #166534;
          font-size: 28px;
          margin-bottom: 8px;
        }
        .header .subtitle {
          color: #6b7280;
          font-size: 14px;
        }
        .header .date {
          color: #9ca3af;
          font-size: 12px;
          margin-top: 8px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse;
          margin-bottom: 30px;
          font-size: 13px;
        }
        th { 
          background: linear-gradient(135deg, #166534, #22c55e);
          color: white;
          padding: 14px 12px;
          text-align: left;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.5px;
        }
        td { 
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        tr:nth-child(even) { background-color: #f9fafb; }
        tr:hover { background-color: #f0fdf4; }
        .summary { 
          margin-top: 30px;
          padding: 24px;
          background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
          border-radius: 12px;
          border: 1px solid #bbf7d0;
        }
        .summary h3 { 
          color: #166534;
          margin-bottom: 16px;
          font-size: 16px;
        }
        .summary-grid { 
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }
        .summary-item { 
          display: flex;
          justify-content: space-between;
          padding: 12px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .summary-label { color: #6b7280; font-size: 13px; }
        .summary-value { font-weight: 600; color: #166534; }
        .footer { 
          margin-top: 40px;
          text-align: center;
          color: #9ca3af;
          font-size: 11px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #22c55e;
          margin-bottom: 4px;
        }
        @media print {
          body { padding: 20px; }
          .header { page-break-after: avoid; }
          tr { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🌱 Argom</div>
        <h1>${title}</h1>
        ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
        <p class="date">Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            ${columns.map(col => `<th>${col.header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${columns.map(col => `<td>${row[col.key] ?? '-'}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      ${summary && summary.length > 0 ? `
        <div class="summary">
          <h3>📊 Resumo</h3>
          <div class="summary-grid">
            ${summary.map(item => `
              <div class="summary-item">
                <span class="summary-label">${item.label}</span>
                <span class="summary-value">${item.value}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      <div class="footer">
        <p>Sistema Argom - Gestão Inteligente de Propriedades Rurais</p>
        <p>© ${new Date().getFullYear()} Todos os direitos reservados</p>
      </div>
    </body>
    </html>
  `;
}

// Print PDF (opens print dialog)
export function printPDF(exportData: ExportData): void {
  const html = generatePDFHTML(exportData);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

// Export button component data formatter
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('pt-BR');
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}
