import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CheckCircle, Clock, FileText, Package, PlusCircle, XCircle } from 'lucide-react';

interface DashboardProps {
    user: {
        name: string;
        email: string;
    };
    cargo: string | null;
    curso: string | null;
    materiais: {
        id: number;
        nome: string;
        descricao: string;
        quantidade_disponivel: number;
    }[];
    requisicoes: {
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
    }[];
    estatisticas: {
        total: number;
        pendentes: number;
        aprovadas: number;
        rejeitadas: number;
    };
    materiaisMaisRequisitados: {
        id: number;
        nome: string;
        total: number;
    }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ user, cargo, curso, materiais, requisicoes, estatisticas, materiaisMaisRequisitados }: DashboardProps) {
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
        } catch (_) {
            return dateString;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard | ExpoMateriais" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Saudação */}
                <div className="mb-2">
                    <h1 className="text-2xl font-bold">Olá, {user.name}!</h1>
                    {curso && (
                        <p className="text-muted-foreground">
                            {cargo ? `${cargo} | ` : ''}Curso: {curso}
                        </p>
                    )}
                </div>

                {/* Status Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card className="flex flex-col items-center justify-center p-4">
                        <div className="mb-2 flex items-center justify-center">
                            <FileText className="h-8 w-8 text-blue-500" />
                        </div>
                        <h3 className="text-2xl font-bold">{estatisticas.total}</h3>
                        <p className="text-muted-foreground text-sm">Total de Requisições</p>
                    </Card>

                    <Card className="flex flex-col items-center justify-center p-4">
                        <div className="mb-2 flex items-center justify-center">
                            <Clock className="h-8 w-8 text-yellow-500" />
                        </div>
                        <h3 className="text-2xl font-bold">{estatisticas.pendentes}</h3>
                        <p className="text-muted-foreground text-sm">Pendentes</p>
                    </Card>

                    <Card className="flex flex-col items-center justify-center p-4">
                        <div className="mb-2 flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold">{estatisticas.aprovadas}</h3>
                        <p className="text-muted-foreground text-sm">Aprovadas</p>
                    </Card>

                    <Card className="flex flex-col items-center justify-center p-4">
                        <div className="mb-2 flex items-center justify-center">
                            <XCircle className="h-8 w-8 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold">{estatisticas.rejeitadas}</h3>
                        <p className="text-muted-foreground text-sm">Rejeitadas</p>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Recent Requests Table */}
                    <Card className="p-4 md:col-span-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Requisições Recentes</h2>
                            <Link href="/requisicoes/create">
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                    <PlusCircle className="h-4 w-4" />
                                    Nova Requisição
                                </Button>
                            </Link>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Material</TableHead>
                                    <TableHead>Qtd</TableHead>
                                    <TableHead>Finalidade</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requisicoes.length > 0 ? (
                                    requisicoes.map((req) => (
                                        <TableRow key={req.id}>
                                            <TableCell className="font-medium">{req.material.nome}</TableCell>
                                            <TableCell>{req.quantidade}</TableCell>
                                            <TableCell>{req.finalidade}</TableCell>
                                            <TableCell>{formatDate(req.created_at)}</TableCell>
                                            <TableCell>{getStatusBadge(req.estado.id, req.estado.nome)}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-muted-foreground py-4 text-center">
                                            Nenhuma requisição encontrada.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <div className="mt-4 flex justify-end">
                            <Link href="/requisicoes">
                                <Button variant="outline" size="sm">
                                    Ver Todas
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    {/* Quick Access */}
                    <Card className="flex flex-col gap-3 p-4">
                        <h2 className="text-xl font-semibold">Acesso Rápido</h2>

                        <Link href="/requisicoes/create">
                            <Button className="flex w-full justify-start gap-2">
                                <PlusCircle className="h-5 w-5" />
                                Nova Requisição
                            </Button>
                        </Link>

                        <Link href="/materiais">
                            <Button variant="outline" className="flex w-full justify-start gap-2">
                                <Package className="h-5 w-5" />
                                Materiais Disponíveis
                            </Button>
                        </Link>

                        <Link href="/requisicoes">
                            <Button variant="outline" className="flex w-full justify-start gap-2">
                                <FileText className="h-5 w-5" />
                                Minhas Requisições
                            </Button>
                        </Link>

                        <div className="mt-4">
                            <h3 className="mb-2 text-sm font-medium">Materiais Mais Solicitados</h3>
                            <div className="flex flex-wrap gap-2">
                                {materiaisMaisRequisitados.length > 0 ? (
                                    materiaisMaisRequisitados.map((mat) => (
                                        <Badge key={mat.id} variant="secondary">
                                            {mat.nome}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground text-sm">Nenhum material requisitado ainda.</p>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Available Materials */}
                <Card className="p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Materiais para Requisição</h2>
                        <Link href="/materiais">
                            <Button variant="outline" size="sm">
                                Ver Catálogo Completo
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {materiais.slice(0, 4).map((material) => (
                            <Card key={material.id} className="p-3">
                                <div className="relative mb-2 aspect-video overflow-hidden rounded-lg">
                                    <PlaceholderPattern className="absolute inset-0 size-full" />
                                </div>
                                <h3 className="truncate font-medium">{material.nome}</h3>
                                <p className="text-muted-foreground text-sm">Disponíveis: {material.quantidade_disponivel} unidades</p>
                                <Link href={`/requisicoes/create?material_id=${material.id}`}>
                                    <Button variant="outline" size="sm" className="mt-2 w-full">
                                        Requisitar
                                    </Button>
                                </Link>
                            </Card>
                        ))}
                        {materiais.length === 0 && (
                            <div className="text-muted-foreground col-span-4 py-8 text-center">Nenhum material disponível para requisição.</div>
                        )}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
