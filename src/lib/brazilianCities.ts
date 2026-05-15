export interface City { name: string; state: string; region: string; query: string; }

export function normalizeCity(name: string): string {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

export const REGIONS = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"] as const;

export const BRAZILIAN_CITIES: City[] = [
  // Capitais
  {name:"São Paulo",state:"SP",region:"Sudeste",query:"sao paulo"},
  {name:"Rio de Janeiro",state:"RJ",region:"Sudeste",query:"rio de janeiro"},
  {name:"Belo Horizonte",state:"MG",region:"Sudeste",query:"belo horizonte"},
  {name:"Brasília",state:"DF",region:"Centro-Oeste",query:"brasilia"},
  {name:"Salvador",state:"BA",region:"Nordeste",query:"salvador"},
  {name:"Fortaleza",state:"CE",region:"Nordeste",query:"fortaleza"},
  {name:"Manaus",state:"AM",region:"Norte",query:"manaus"},
  {name:"Curitiba",state:"PR",region:"Sul",query:"curitiba"},
  {name:"Recife",state:"PE",region:"Nordeste",query:"recife"},
  {name:"Porto Alegre",state:"RS",region:"Sul",query:"porto alegre"},
  {name:"Belém",state:"PA",region:"Norte",query:"belem"},
  {name:"Goiânia",state:"GO",region:"Centro-Oeste",query:"goiania"},
  {name:"Florianópolis",state:"SC",region:"Sul",query:"florianopolis"},
  {name:"Maceió",state:"AL",region:"Nordeste",query:"maceio"},
  {name:"Natal",state:"RN",region:"Nordeste",query:"natal"},
  {name:"Teresina",state:"PI",region:"Nordeste",query:"teresina"},
  {name:"Campo Grande",state:"MS",region:"Centro-Oeste",query:"campo grande"},
  {name:"João Pessoa",state:"PB",region:"Nordeste",query:"joao pessoa"},
  {name:"Cuiabá",state:"MT",region:"Centro-Oeste",query:"cuiaba"},
  {name:"Palmas",state:"TO",region:"Norte",query:"palmas"},
  {name:"São Luís",state:"MA",region:"Nordeste",query:"sao luis"},
  {name:"Vitória",state:"ES",region:"Sudeste",query:"vitoria"},
  {name:"Porto Velho",state:"RO",region:"Norte",query:"porto velho"},
  {name:"Macapá",state:"AP",region:"Norte",query:"macapa"},
  {name:"Rio Branco",state:"AC",region:"Norte",query:"rio branco"},
  {name:"Boa Vista",state:"RR",region:"Norte",query:"boa vista"},
  // SP
  {name:"Campinas",state:"SP",region:"Sudeste",query:"campinas"},
  {name:"Ribeirão Preto",state:"SP",region:"Sudeste",query:"ribeirao preto"},
  {name:"Sorocaba",state:"SP",region:"Sudeste",query:"sorocaba"},
  {name:"São José dos Campos",state:"SP",region:"Sudeste",query:"sao jose dos campos"},
  {name:"Bauru",state:"SP",region:"Sudeste",query:"bauru"},
  {name:"Piracicaba",state:"SP",region:"Sudeste",query:"piracicaba"},
  {name:"Presidente Prudente",state:"SP",region:"Sudeste",query:"presidente prudente"},
  {name:"Marília",state:"SP",region:"Sudeste",query:"marilia"},
  {name:"Araçatuba",state:"SP",region:"Sudeste",query:"aracatuba"},
  {name:"Franca",state:"SP",region:"Sudeste",query:"franca"},
  // PR
  {name:"Londrina",state:"PR",region:"Sul",query:"londrina"},
  {name:"Maringá",state:"PR",region:"Sul",query:"maringa"},
  {name:"Ponta Grossa",state:"PR",region:"Sul",query:"ponta grossa"},
  {name:"Cascavel",state:"PR",region:"Sul",query:"cascavel"},
  {name:"Foz do Iguaçu",state:"PR",region:"Sul",query:"foz do iguacu"},
  {name:"Guarapuava",state:"PR",region:"Sul",query:"guarapuava"},
  {name:"Toledo",state:"PR",region:"Sul",query:"toledo"},
  {name:"Apucarana",state:"PR",region:"Sul",query:"apucarana"},
  {name:"Francisco Beltrão",state:"PR",region:"Sul",query:"francisco beltrao"},
  {name:"Paranavaí",state:"PR",region:"Sul",query:"paranavai"},
  {name:"Umuarama",state:"PR",region:"Sul",query:"umuarama"},
  {name:"Campo Mourão",state:"PR",region:"Sul",query:"campo mourao"},
  {name:"São José das Palmeiras",state:"PR",region:"Sul",query:"sao jose das palmeiras"},
  {name:"Palotina",state:"PR",region:"Sul",query:"palotina"},
  {name:"Medianeira",state:"PR",region:"Sul",query:"medianeira"},
  // RS
  {name:"Caxias do Sul",state:"RS",region:"Sul",query:"caxias do sul"},
  {name:"Pelotas",state:"RS",region:"Sul",query:"pelotas"},
  {name:"Santa Maria",state:"RS",region:"Sul",query:"santa maria"},
  {name:"Passo Fundo",state:"RS",region:"Sul",query:"passo fundo"},
  {name:"Uruguaiana",state:"RS",region:"Sul",query:"uruguaiana"},
  {name:"Bento Gonçalves",state:"RS",region:"Sul",query:"bento goncalves"},
  // SC
  {name:"Joinville",state:"SC",region:"Sul",query:"joinville"},
  {name:"Blumenau",state:"SC",region:"Sul",query:"blumenau"},
  {name:"Chapecó",state:"SC",region:"Sul",query:"chapeco"},
  {name:"Itajaí",state:"SC",region:"Sul",query:"itajai"},
  {name:"Criciúma",state:"SC",region:"Sul",query:"criciuma"},
  {name:"Lages",state:"SC",region:"Sul",query:"lages"},
  // MG
  {name:"Uberlândia",state:"MG",region:"Sudeste",query:"uberlandia"},
  {name:"Juiz de Fora",state:"MG",region:"Sudeste",query:"juiz de fora"},
  {name:"Uberaba",state:"MG",region:"Sudeste",query:"uberaba"},
  {name:"Montes Claros",state:"MG",region:"Sudeste",query:"montes claros"},
  {name:"Patos de Minas",state:"MG",region:"Sudeste",query:"patos de minas"},
  {name:"Lavras",state:"MG",region:"Sudeste",query:"lavras"},
  // GO/MS/MT
  {name:"Anápolis",state:"GO",region:"Centro-Oeste",query:"anapolis"},
  {name:"Rio Verde",state:"GO",region:"Centro-Oeste",query:"rio verde"},
  {name:"Jataí",state:"GO",region:"Centro-Oeste",query:"jatai"},
  {name:"Dourados",state:"MS",region:"Centro-Oeste",query:"dourados"},
  {name:"Rondonópolis",state:"MT",region:"Centro-Oeste",query:"rondonopolis"},
  {name:"Sinop",state:"MT",region:"Centro-Oeste",query:"sinop"},
  {name:"Sorriso",state:"MT",region:"Centro-Oeste",query:"sorriso"},
  {name:"Lucas do Rio Verde",state:"MT",region:"Centro-Oeste",query:"lucas do rio verde"},
  // BA
  {name:"Feira de Santana",state:"BA",region:"Nordeste",query:"feira de santana"},
  {name:"Vitória da Conquista",state:"BA",region:"Nordeste",query:"vitoria da conquista"},
  {name:"Barreiras",state:"BA",region:"Nordeste",query:"barreiras"},
  {name:"Juazeiro",state:"BA",region:"Nordeste",query:"juazeiro"},
  {name:"Luís Eduardo Magalhães",state:"BA",region:"Nordeste",query:"luis eduardo magalhaes"},
  // CE/PE/outros NE
  {name:"Juazeiro do Norte",state:"CE",region:"Nordeste",query:"juazeiro do norte"},
  {name:"Sobral",state:"CE",region:"Nordeste",query:"sobral"},
  {name:"Caruaru",state:"PE",region:"Nordeste",query:"caruaru"},
  {name:"Petrolina",state:"PE",region:"Nordeste",query:"petrolina"},
  {name:"Campina Grande",state:"PB",region:"Nordeste",query:"campina grande"},
  {name:"Mossoró",state:"RN",region:"Nordeste",query:"mossoro"},
  {name:"Imperatriz",state:"MA",region:"Nordeste",query:"imperatriz"},
];

export function searchCities(query: string, limit = 8): City[] {
  if (!query.trim()) return [];
  const n = normalizeCity(query);
  const scored = BRAZILIAN_CITIES.reduce<Array<{city:City;score:number}>>((acc, city) => {
    const cn = normalizeCity(city.name);
    const sn = city.state.toLowerCase();
    if (cn.startsWith(n))     acc.push({city, score: 3});
    else if (cn.includes(n))  acc.push({city, score: 2});
    else if (sn === n)        acc.push({city, score: 1});
    return acc;
  }, []);
  return scored.sort((a,b) => b.score - a.score).slice(0, limit).map(s => s.city);
}

export function getCitiesByRegion(region: string): City[] {
  return BRAZILIAN_CITIES.filter(c => c.region === region);
}
