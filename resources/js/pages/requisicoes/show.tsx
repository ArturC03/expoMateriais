// resources/js/pages/requisicoes/show.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Banknote, Check, Clock, Eye, FileText, Package, User, X } from 'lucide-react';

interface RequisicaoShowProps {
    requisicao: {
        id: number;
        material: {
            id: number;
            nome: string;
            descricao: string;
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
        resposta?: string;
        respondido_em?: string;
        respondido_por?: {
            id: number;
            name: string;
        };
    };
    isAdmin: boolean;
}

export default function RequisicaoShow({ requisicao, isAdmin }: RequisicaoShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Requisições', href: '/requisicoes' },
        { title: `Requisição #${requisicao.id}`, href: `/requisicoes/${requisicao.id}` },
    ];

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '';
        try {
            return format(parseISO(dateString), 'dd/MM/yyyy HH:mm', { locale: pt });
        } catch (error) {
            return dateString;
        }
    };

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

    const isPending = requisicao.estado.id === 1;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Requisição #${requisicao.id} | ExpoMateriais`} />

            <div className="p-4">
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold">Requisição #{requisicao.id}</h1>
                            {getStatusBadge(requisicao.estado.id, requisicao.estado.nome)}
                        </div>
                        <p className="text-muted-foreground">Criada em {formatDate(requisicao.created_at)}</p>
                    </div>

                    {isAdmin && isPending && (
                        <div className="flex gap-2">
                            <Link href={`/requisicoes/${requisicao.id}/aprovar`} method="post" as="button">
                                <Button variant="outline" className="gap-2 text-green-600">
                                    <Check className="h-4 w-4" />
                                    Aprovar
                                </Button>
                            </Link>
                            <Link href={`/requisicoes/${requisicao.id}/rejeitar`} method="post" as="button">
                                <Button variant="outline" className="gap-2 text-red-600">
                                    <X className="h-4 w-4" />
                                    Rejeitar
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="p-6 lg:col-span-2">
                        <h2 className="text-xl font-semibold">Detalhes da Requisição</h2>

                        <div className="mt-6 grid gap-6 sm:grid-cols-2">
                            <div>
                                <h3 className="mb-2 text-sm font-medium">Material Solicitado</h3>
                                <div className="text-muted-foreground flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    <Link href={`/materiais/${requisicao.material.id}`} className="hover:underline">
                                        {requisicao.material.nome}
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-2 text-sm font-medium">Quantidade</h3>
                                <p className="text-muted-foreground flex items-center gap-2">
                                    <Banknote className="h-4 w-4" />
                                    {requisicao.quantidade} unidades
                                </p>
                            </div>

                            <div>
                                <h3 className="mb-2 text-sm font-medium">Projeto</h3>
                                <p className="text-muted-foreground flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    {requisicao.projeto.titulo}
                                </p>
                            </div>

                            <div>
                                <h3 className="mb-2 text-sm font-medium">Status</h3>
                                <div className="flex items-center gap-2">
                                    {requisicao.estado.id === 1 && <Clock className="h-4 w-4 text-yellow-500" />}
                                    {requisicao.estado.id === 2 && <Check className="h-4 w-4 text-green-500" />}
                                    {requisicao.estado.id === 3 && <X className="h-4 w-4 text-red-500" />}
                                    {getStatusBadge(requisicao.estado.id, requisicao.estado.nome)}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="mb-2 text-sm font-medium">Finalidade</h3>
                            <div className="text-muted-foreground rounded-md border p-3">
                                <p className="whitespace-pre-line">{requisicao.finalidade}</p>
                            </div>
                        </div>

                        {requisicao.resposta && (
                            <div className="mt-6">
                                <h3 className="mb-2 text-sm font-medium">Resposta</h3>
                                <div className="rounded-md border p-3">
                                    <div className="mb-2 flex items-center gap-2">
                                        <User className="text-muted-foreground h-4 w-4" />
                                        <span className="text-muted-foreground text-xs">
                                            Respondido por {requisicao.respondido_por?.name} em {formatDate(requisicao.respondido_em)}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground whitespace-pre-line">{requisicao.resposta}</p>
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card className="p-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium">Informações do Material</h3>
                        </div>

                        <div className="mb-4">
                            <h4 className="mb-1 text-sm font-medium">{requisicao.material.nome}</h4>
                            <p className="text-muted-foreground line-clamp-4 text-sm">{requisicao.material.descricao}</p>
                        </div>

                        <Link href={`/materiais/${requisicao.material.id}`}>
                            <Button variant="outline" className="w-full gap-2">
                                <Eye className="h-4 w-4" />
                                Ver detalhes do material
                            </Button>
                        </Link>

                        {isPending && (
                            <div className="mt-6">
                                <div className="mb-2 flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-yellow-500" />
                                    <h3 className="font-medium">Aguardando Aprovação</h3>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                    Sua requisição está sendo analisada pelos administradores. Você receberá uma resposta em breve.
                                </p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
