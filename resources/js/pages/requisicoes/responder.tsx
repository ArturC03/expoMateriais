// resources/js/pages/requisicoes/responder.tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, useForm } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useState } from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import * as z from 'zod';

interface ResponderRequisicaoProps {
    requisicao: {
        id: number;
        material: {
            nome: string;
        };
        quantidade: number;
        finalidade: string;
        created_at: string;
        estado: {
            id: number;
            nome: string;
        };
    };
    aprovar: boolean;
}

const formSchema = z.object({
    resposta: z.string().min(5, { message: 'A resposta deve ter pelo menos 5 caracteres' }),
});

export default function ResponderRequisicao({ requisicao, aprovar }: ResponderRequisicaoProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Requisições', href: '/requisicoes' },
        { title: `Requisição #${requisicao.id}`, href: `/requisicoes/${requisicao.id}` },
        { title: aprovar ? 'Aprovar' : 'Rejeitar', href: `/requisicoes/${requisicao.id}/${aprovar ? 'aprovar' : 'rejeitar'}` },
    ];

    const formatDate = (dateString: string) => {
        try {
            return format(parseISO(dateString), 'dd/MM/yyyy', { locale: pt });
        } catch (error) {
            return dateString;
        }
    };

    const form = useHookForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            resposta: '',
        },
    });

    const inertiaForm = useForm({
        resposta: '',
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        const url = `/requisicoes/${requisicao.id}/${aprovar ? 'aprovar' : 'rejeitar'}`;
        inertiaForm.post(url, values, {
            onFinish: () => setIsSubmitting(false),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${aprovar ? 'Aprovar' : 'Rejeitar'} Requisição | ExpoMateriais`} />

            <div className="p-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">
                        {aprovar ? 'Aprovar' : 'Rejeitar'} Requisição #{requisicao.id}
                    </h1>
                    <p className="text-muted-foreground">
                        {aprovar ? 'Forneça informações adicionais sobre a aprovação' : 'Explique o motivo da rejeição desta requisição'}
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="p-6 lg:col-span-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="resposta"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{aprovar ? 'Informações da Aprovação' : 'Motivo da Rejeição'}</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder={
                                                        aprovar
                                                            ? 'Informe detalhes sobre a aprovação, como onde e quando retirar o material...'
                                                            : 'Explique o motivo pelo qual a requisição está sendo rejeitada...'
                                                    }
                                                    className="min-h-32"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                {aprovar
                                                    ? 'Estas informações serão enviadas ao solicitante'
                                                    : 'Esta justificativa será enviada ao solicitante'}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-2 pt-4">
                                    <Button type="submit" disabled={isSubmitting} variant={aprovar ? 'default' : 'destructive'}>
                                        {isSubmitting ? 'Processando...' : aprovar ? 'Confirmar Aprovação' : 'Confirmar Rejeição'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-lg font-semibold">Resumo da Requisição</h2>

                        <div className="mt-4 space-y-4">
                            <div>
                                <h3 className="text-sm font-medium">Material</h3>
                                <p className="text-muted-foreground">{requisicao.material.nome}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium">Quantidade</h3>
                                <p className="text-muted-foreground">{requisicao.quantidade} unidades</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium">Data da Solicitação</h3>
                                <p className="text-muted-foreground">{formatDate(requisicao.created_at)}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium">Finalidade</h3>
                                <p className="text-muted-foreground line-clamp-5">{requisicao.finalidade}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
