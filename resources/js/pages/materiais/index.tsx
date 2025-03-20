// resources/js/pages/materiais/index.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Package, Search } from 'lucide-react';
import { useState } from 'react';

interface MaterialItem {
    id: number;
    nome: string;
    descricao: string;
    quantidade_disponivel: number;
    categoria: {
        id: number;
        nome: string;
    };
}

interface MateriaisIndexProps {
    materiais: MaterialItem[];
    categorias: {
        id: number;
        nome: string;
    }[];
    isAdmin: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Materiais',
        href: '/materiais',
    },
];

export default function MateriaisIndex({ materiais, categorias, isAdmin }: MateriaisIndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const filteredMateriais = materiais.filter((material) => {
        const matchesSearch =
            material.nome.toLowerCase().includes(searchTerm.toLowerCase()) || material.descricao.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? material.categoria.id === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Catálogo de Materiais | ExpoMateriais" />

            <div className="p-4">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Catálogo de Materiais</h1>
                        <p className="text-muted-foreground">Explore e requisite materiais disponíveis</p>
                    </div>

                    {isAdmin && (
                        <Link href="/materiais/create">
                            <Button>Adicionar Material</Button>
                        </Link>
                    )}
                </div>

                <Card className="mb-6 p-4">
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-grow">
                            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                            <Input
                                placeholder="Buscar materiais..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge
                                variant={selectedCategory === null ? 'default' : 'outline'}
                                className="cursor-pointer"
                                onClick={() => setSelectedCategory(null)}
                            >
                                Todos
                            </Badge>
                            {categorias.map((categoria) => (
                                <Badge
                                    key={categoria.id}
                                    variant={selectedCategory === categoria.id ? 'default' : 'outline'}
                                    className="cursor-pointer"
                                    onClick={() => setSelectedCategory(categoria.id)}
                                >
                                    {categoria.nome}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </Card>

                {filteredMateriais.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredMateriais.map((material) => (
                            <Card key={material.id} className="overflow-hidden">
                                <div className="relative aspect-video">
                                    <PlaceholderPattern className="absolute inset-0" />
                                    <div className="absolute right-2 bottom-2">
                                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                                            {material.categoria.nome}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="mb-1 text-lg font-medium">{material.nome}</h3>
                                    <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">{material.descricao}</p>
                                    <div className="mb-4 flex items-center gap-2">
                                        <Package className="h-4 w-4" />
                                        <span className="text-sm font-medium">{material.quantidade_disponivel} unidades disponíveis</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/materiais/${material.id}`} className="flex-1">
                                            <Button variant="outline" className="w-full">
                                                Detalhes
                                            </Button>
                                        </Link>
                                        <Link href={`/requisicoes/create?material_id=${material.id}`} className="flex-1">
                                            <Button className="w-full">Requisitar</Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                        <Package className="text-muted-foreground mb-2 h-12 w-12" />
                        <h3 className="text-lg font-medium">Nenhum material encontrado</h3>
                        <p className="text-muted-foreground mb-4">Tente ajustar seus filtros de busca.</p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory(null);
                            }}
                        >
                            Limpar filtros
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
