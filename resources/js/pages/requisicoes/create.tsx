// resources/js/pages/requisicoes/create.tsx
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

interface RequisicaoCreateProps {
    materiais: {
        id: number;
        nome: string;
        quantidade_disponivel: number;
    }[];
    projetos: {
        id: number;
        titulo: string;
    }[];
    material_id?: number;
}

const formSchema = z.object({
    material_id: z.coerce.number().int().positive({ message: 'Selecione um material' }),
    quantidade: z.coerce.number().int().positive({ message: 'A quantidade deve ser maior que zero' }),
    finalidade: z.string().min(10, { message: 'Descreva a finalidade com pelo menos 10 caracteres' }),
    projeto_id: z.coerce.number().int().positive({ message: 'Selecione um projeto' }),
});

export default function RequisicaoCreate({ materiais, projetos, material_id }: RequisicaoCreateProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(material_id ? materiais.find((m) => m.id === Number(material_id)) : null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Requisições', href: '/requisicoes' },
        { title: 'Nova Requisição', href: '/requisicoes/create' },
    ];

    const form = useHookForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            material_id: material_id ? Number(material_id) : 0,
            quantidade: 1,
            finalidade: '',
            projeto_id: 0,
        },
    });

    const inertiaForm = useForm({
        material_id: material_id ? Number(material_id) : '',
        quantidade: 1,
        finalidade: '',
        projeto_id: '',
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        inertiaForm.post('/requisicoes', values, {
            onFinish: () => setIsSubmitting(false),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nova Requisição | ExpoMateriais" />

            <div className="p-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Nova Requisição</h1>
                    <p className="text-muted-foreground">Solicite um material para seu projeto</p>
                </div>

                <Card className="max-w-3xl p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="material_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Material</FormLabel>
                                        <Select
                                            value={field.value ? field.value.toString() : ''}
                                            onValueChange={(value) => {
                                                field.onChange(Number(value));
                                                setSelectedMaterial(materiais.find((m) => m.id === Number(value)) || null);
                                            }}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione um material" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {materiais.map((material) => (
                                                    <SelectItem key={material.id} value={material.id.toString()}>
                                                        {material.nome} ({material.quantidade_disponivel} disponíveis)
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {selectedMaterial && (
                                            <FormDescription>Disponível: {selectedMaterial.quantidade_disponivel} unidades</FormDescription>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="quantidade"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantidade</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="1" max={selectedMaterial?.quantidade_disponivel || 999} {...field} />
                                        </FormControl>
                                        <FormDescription>Informe a quantidade necessária para seu projeto</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="projeto_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Projeto</FormLabel>
                                        <Select
                                            value={field.value ? field.value.toString() : ''}
                                            onValueChange={(value) => field.onChange(Number(value))}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione um projeto" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {projetos.map((projeto) => (
                                                    <SelectItem key={projeto.id} value={projeto.id.toString()}>
                                                        {projeto.titulo}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Projeto para o qual o material será utilizado</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="finalidade"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Finalidade</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Descreva como o material será utilizado no projeto"
                                                className="min-h-32"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>Explique detalhadamente como o material será utilizado</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-2 pt-4">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Enviando...' : 'Enviar Requisição'}
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
