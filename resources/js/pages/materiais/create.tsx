// resources/js/pages/materiais/create.tsx (e edit.tsx adaptado)
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import * as z from 'zod';

interface MaterialCreateProps {
    categorias: {
        id: number;
        nome: string;
    }[];
    material?: {
        id: number;
        nome: string;
        descricao: string;
        quantidade_disponivel: number;
        categoria_id: number;
    };
}

const formSchema = z.object({
    nome: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
    descricao: z.string().min(10, { message: 'A descrição deve ter pelo menos 10 caracteres' }),
    quantidade_disponivel: z.coerce.number().int().min(0, { message: 'A quantidade não pode ser negativa' }),
    categoria_id: z.coerce.number().int().positive({ message: 'Selecione uma categoria' }),
});

export default function MaterialCreate({ categorias, material }: MaterialCreateProps) {
    const editing = !!material;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Materiais', href: '/materiais' },
        { title: editing ? 'Editar Material' : 'Novo Material', href: editing ? `/materiais/${material.id}/edit` : '/materiais/create' },
    ];

    const form = useHookForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: material?.nome || '',
            descricao: material?.descricao || '',
            quantidade_disponivel: material?.quantidade_disponivel || 0,
            categoria_id: material?.categoria_id || 0,
        },
    });

    const inertiaForm = useForm({
        nome: material?.nome || '',
        descricao: material?.descricao || '',
        quantidade_disponivel: material?.quantidade_disponivel || 0,
        categoria_id: material?.categoria_id || 0,
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        if (editing) {
            inertiaForm.put(`/materiais/${material.id}`, values, {
                onFinish: () => setIsSubmitting(false),
            });
        } else {
            inertiaForm.post('/materiais', values, {
                onFinish: () => setIsSubmitting(false),
            });
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${editing ? 'Editar' : 'Novo'} Material | ExpoMateriais`} />

            <div className="p-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">{editing ? 'Editar Material' : 'Novo Material'}</h1>
                    <p className="text-muted-foreground">
                        {editing ? 'Atualize as informações do material' : 'Cadastre um novo material no sistema'}
                    </p>
                </div>

                <Card className="max-w-3xl p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="nome"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome do Material</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Arduino Uno" {...field} />
                                        </FormControl>
                                        <FormDescription>Nome completo e identificável do material</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="categoria_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Categoria</FormLabel>
                                        <Select value={field.value.toString()} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione uma categoria" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categorias.map((categoria) => (
                                                    <SelectItem key={categoria.id} value={categoria.id.toString()}>
                                                        {categoria.nome}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="descricao"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descrição</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Descreva detalhes, especificações e informações relevantes do material"
                                                className="min-h-32"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="quantidade_disponivel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantidade Disponível</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" {...field} />
                                        </FormControl>
                                        <FormDescription>Quantas unidades estão disponíveis para requisição</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-2 pt-4">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Salvando...' : editing ? 'Atualizar Material' : 'Cadastrar Material'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </Form>
                </Card>
            </div>
        </AppLayout>
    );
}
