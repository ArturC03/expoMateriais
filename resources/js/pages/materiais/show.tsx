// resources/js/pages/materiais/show.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Box, CalendarRange, Edit, FileText, Package, Trash } from 'lucide-react';

interface MaterialShowProps {
    material: {
        id: number;
        nome: string;
        descricao: string;
        quantidade_disponivel: number;
        categoria: {
            id: number;
            nome: string;
        };
        historico_requisicoes: number;
        created_at: string;
        updated_at: string;
    };
    isAdmin: boolean;
}

export default function MaterialShow({ material, isAdmin }: MaterialShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Materiais',
            href: '/materiais',
        },
        {
            title: material.nome,
            href: `/materiais/${material.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${material.nome} | ExpoMateriais`} />

            <div className="p-4">
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">{material.nome}</h1>
                        <div className="mt-1">
                            <Badge variant="secondary">{material.categoria.nome}</Badge>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Link href={`/requisicoes/create?material_id=${material.id}`}>
                            <Button>Requisitar Material</Button>
                        </Link>

                        {isAdmin && (
                            <>
                                <Link href={`/materiais/${material.id}/edit`}>
                                    <Button variant="outline">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar
                                    </Button>
                                </Link>
                                <Link href={`/materiais/${material.id}`} method="delete" as="button">
                                    <Button variant="destructive">
                                        <Trash className="mr-2 h-4 w-4" />
                                        Excluir
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="md:col-span-2">
                        <div className="relative aspect-video">
                            <PlaceholderPattern className="absolute inset-0" />
                        </div>
                        <div className="p-6">
                            <h2 className="mb-2 text-xl font-semibold">Descrição</h2>
                            <p className="text-muted-foreground whitespace-pre-line">{material.descricao}</p>
                        </div>
                    </Card>

                    <div className="flex flex-col gap-6">
                        <Card className="p-6">
                            <h2 className="mb-4 text-xl font-semibold">Informações</h2>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <Box className="text-muted-foreground h-5 w-5" />
                                    <div>
                                        <p className="text-sm font-medium">Quantidade Disponível</p>
                                        <p className="text-muted-foreground">{material.quantidade_disponivel} unidades</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <FileText className="text-muted-foreground h-5 w-5" />
                                    <div>
                                        <p className="text-sm font-medium">Histórico de Requisições</p>
                                        <p className="text-muted-foreground">{material.historico_requisicoes} requisições</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <CalendarRange className="text-muted-foreground h-5 w-5" />
                                    <div>
                                        <p className="text-sm font-medium">Registro no Sistema</p>
                                        <p className="text-muted-foreground">{new Date(material.created_at).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center gap-4">
                                <Package className="text-primary h-10 w-10" />
                                <div>
                                    <h3 className="text-lg font-medium">Precisa deste material?</h3>
                                    <p className="text-muted-foreground text-sm">Faça uma requisição agora mesmo</p>
                                </div>
                            </div>
                            <Link href={`/requisicoes/create?material_id=${material.id}`} className="mt-4 block">
                                <Button className="w-full">Requisitar Material</Button>
                            </Link>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
