
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  X, 
  Download,
  MessageSquare,
  User,
  Clock
} from 'lucide-react';

interface AdvancedSearchProps {
  onSearchResults: (results: any[]) => void;
}

const AdvancedSearch = ({ onSearchResults }: AdvancedSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    department: '',
    agent: '',
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
    messageType: ''
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const mockResults = [
    {
      id: 1,
      contact: 'Maria Silva',
      phone: '+55 11 99999-9999',
      message: 'Olá, preciso de ajuda com meu pedido',
      agent: 'João Santos',
      department: 'Vendas',
      timestamp: '2024-01-15 10:30',
      status: 'ativo'
    },
    {
      id: 2,
      contact: 'Pedro Costa',
      phone: '+55 11 88888-8888',
      message: 'Quando meu produto vai chegar?',
      agent: 'Ana Oliveira',
      department: 'Suporte',
      timestamp: '2024-01-15 14:22',
      status: 'encerrado'
    }
  ];

  const handleSearch = () => {
    // Simular busca
    onSearchResults(mockResults);
    
    // Atualizar filtros ativos
    const active = [];
    if (searchTerm) active.push(`Termo: "${searchTerm}"`);
    if (filters.status) active.push(`Status: ${filters.status}`);
    if (filters.department) active.push(`Departamento: ${filters.department}`);
    if (filters.agent) active.push(`Agente: ${filters.agent}`);
    if (filters.dateFrom) active.push(`De: ${format(filters.dateFrom, 'dd/MM/yyyy')}`);
    if (filters.dateTo) active.push(`Até: ${format(filters.dateTo, 'dd/MM/yyyy')}`);
    
    setActiveFilters(active);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      status: '',
      department: '',
      agent: '',
      dateFrom: undefined,
      dateTo: undefined,
      messageType: ''
    });
    setActiveFilters([]);
    onSearchResults([]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Busca Avançada
          </CardTitle>
          <CardDescription>
            Encontre conversas específicas usando filtros detalhados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Term */}
          <div className="space-y-2">
            <Label htmlFor="search">Termo de Busca</Label>
            <Input
              id="search"
              placeholder="Digite palavras-chave, números de telefone ou nomes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Status da Conversa</Label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="encerrado">Encerrado</SelectItem>
                  <SelectItem value="aguardando">Aguardando</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Departamento</Label>
              <Select 
                value={filters.department} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, department: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="suporte">Suporte</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Agente</Label>
              <Select 
                value={filters.agent} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, agent: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="joao">João Santos</SelectItem>
                  <SelectItem value="ana">Ana Oliveira</SelectItem>
                  <SelectItem value="pedro">Pedro Costa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data Inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFrom ? format(filters.dateFrom, 'dd/MM/yyyy') : 'Selecionar data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => setFilters(prev => ({ ...prev, dateFrom: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Data Final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateTo ? format(filters.dateTo, 'dd/MM/yyyy') : 'Selecionar data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => setFilters(prev => ({ ...prev, dateTo: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={handleSearch} className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="space-y-2">
              <Label>Filtros Ativos</Label>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <Badge key={index} variant="secondary">
                    {filter}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {mockResults.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Resultados da Busca
                </CardTitle>
                <CardDescription>
                  {mockResults.length} conversas encontradas
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockResults.map((result) => (
                <div key={result.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{result.contact}</h3>
                        <p className="text-sm text-gray-500">{result.phone}</p>
                      </div>
                    </div>
                    <Badge variant={result.status === 'ativo' ? 'default' : 'secondary'}>
                      {result.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{result.message}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {result.agent}
                      </span>
                      <span>{result.department}</span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {result.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedSearch;
