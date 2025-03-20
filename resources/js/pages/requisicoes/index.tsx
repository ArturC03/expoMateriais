// resources/js/pages/requisicoes/index.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Check, ChevronDown, Eye, FileQuestion, PlusCircle, Search, X } from 'lucide-react';
import { useState } from 'react';

interface RequisicaoItem {
    id: number;
    material: {
        id: number;
        nome: string;
    };
    quantidade: number;
    finalidade: string;
    created_at: string;
    estado: {
        id: number;
        nome: string;
    };
    projeto: {
        id: number;
        titulo: string;
    };
}

interface RequisicoesIndexProps {
    requisicoes: RequisicaoItem[];
    isAdmin: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Requisições',
        href: '/requisicoes',
    },
];

export default function RequisicoesIndex({ requisicoes, isAdmin }: RequisicoesIndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const getStatusBadge = (estadoId: number, estadoNome: string) => {
        switch (estadoId) {
            case 1: // Pendente
                return (
                    <Badge variant="secondary" className="text-yellow-800 dark:text-yellow-300">
                        {estadoNome}
                    </Badge>
                );
            case 2: // Aprovado
                return (
                    <Badge variant="secondary" className="text-green-800 dark:text-green-300">
                        {estadoNome}
                    </Badge>
                );
            case 3: // Rejeitado
                return (
                    <Badge variant="secondary" className="text-red-800 dark:text-red-300">
                        {estadoNome}
                    </Badge>
                );
            default:
                return <Badge variant="outline">{estadoNome}</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return format(parseISO(dateString), 'dd/MM/yyyy', { locale: pt });
        } catch (error) {
            return dateString;
        }
    };

    const filteredRequisicoes = requisicoes.filter((req) => {
        const matchesSearch =
            req.material.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.finalidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.projeto.titulo.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'pending' && req.estado.id === 1) ||
            (statusFilter === 'approved' && req.estado.id === 2) ||
            (statusFilter === 'rejected' && req.estado.id === 3);

        return matchesSearch && matchesStatus;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Minhas Requisições | ExpoMateriais" />

            <div className="p-4">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Minhas Requisições</h1>
                        <p className="text-muted-foreground">Gerencie suas requisições de materiais</p>
                    </div>

                    <Link href="/requisicoes/create">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Nova Requisição
                        </Button>
                    </Link>
                </div>

                <Card className="mb-6 p-4">
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-grow">
                            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                            <Input
                                placeholder="Buscar requisições..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-48">
                                <div className="flex items-center">
                                    <ChevronDown className="mr-2 h-4 w-4" />
                                    <span>Status</span>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os status</SelectItem>
                                <SelectItem value="pending">Pendentes</SelectItem>
                                <SelectItem value="approved">Aprovadas</SelectItem>
                                <SelectItem value="rejected">Rejeitadas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </Card>

                {filteredRequisicoes.length > 0 ? (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Material</TableHead>
                                    <TableHead>Quantidade</TableHead>
                                    <TableHead>Finalidade</TableHead>
                                    <TableHead>Projeto</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRequisicoes.map((requisicao) => (
                                    <TableRow key={requisicao.id}>
                                        <TableCell className="font-medium">{requisicao.material.nome}</TableCell>
                                        <TableCell>{requisicao.quantidade}</TableCell>
                                        <TableCell className="max-w-xs truncate">{requisicao.finalidade}</TableCell>
                                        <TableCell>{requisicao.projeto.titulo}</TableCell>
                                        <TableCell>{formatDate(requisicao.created_at)}</TableCell>
                                        <TableCell>{getStatusBadge(requisicao.estado.id, requisicao.estado.nome)}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/requisicoes/${requisicao.id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            {isAdmin && requisicao.estado.id === 1 && (
                                                <>
                                                    <Link href={`/requisicoes/${requisicao.id}/aprovar`} method="post" as="button">
                                                        <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700">
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/requisicoes/${requisicao.id}/rejeitar`} method="post" as="button">
                                                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                        <FileQuestion className="text-muted-foreground mb-2 h-12 w-12" />
                        <h3 className="text-lg font-medium">Nenhuma requisição encontrada</h3>
                        <p className="text-muted-foreground mb-4">Você ainda não fez nenhuma requisição ou nenhuma corresponde aos filtros.</p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('all');
                                }}
                            >
                                Limpar filtros
                            </Button>
                            <Link href="/requisicoes/create">
                                <Button>Nova Requisição</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
