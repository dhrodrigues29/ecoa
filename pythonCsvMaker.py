import csv
import random

# 1.  add your TAG_SEGMENTS dict here (or import from tagData.py)
TAG_SEGMENTS = {
    'temporal': [
        'De dia', 'De noite', 'Amanhã', 'Acontecendo hoje',
        'Acontecendo agora', 'Nos próximos 3 dias', 'Neste fim de semana',
        'Próximo sábado', 'Próximo domingo', 'Horário feliz',
        'Pôr do sol', 'Depois das 23h'
    ],
    'estilo': [
        'Open bar', 'Open food', 'Festa temática', 'Festa de rua',
        'Bloco de rua', 'Rolezinho', 'Luau', 'Microlive', 'Show acústico',
        'DJ set', 'Karaokê', 'Quiz night', 'Stand-up', 'Jam session',
        'Casa de festa', 'Pool party', 'Rooftop', 'Terrace party'
    ],
    'cultura': [
        'Expo pop-up', 'Galeria temporária', 'Cinema ao ar livre',
        'Poetry slam', 'Contação de histórias', 'Workshop de arte',
        'Performance de rua', 'Live painting', 'Batalha de MC',
        'Slam de poesia'
    ],
    'gastronomia': [
        'Food truck', 'Praça de alimentação', 'Degustação', 'Menu secreto',
        'Combo happy hour', 'Petisco artesanal', 'Cozinha de rua',
        'Pop-up bar', 'Cerveja artesanal', 'Drink exclusivo', 'Mixologia',
        'Cocktail de autor', 'Rodízio de drinks', 'Tasting night'
    ],
    'musica': [
        'Música ao vivo', 'Banda cover', 'MPB acústica', 'Samba de raiz',
        'Rock independente', 'Pop local', 'Funk carioca', 'Pagode de mesa',
        'Forró pé de serra', 'Electronic night', 'House session',
        'Techno underground'
    ],
    'ambiente': [
        'Ao ar livre', 'Pé na areia', 'Vista para o mar', 'Rooftop',
        'Jardim suspenso', 'Pátio interno', 'Mezanino', 'Subsolo',
        'Luz de néon', 'Iluminação natural', 'Decoração temática', 'Lounge',
        'Dance floor', 'Palco improvisado'
    ],
    'vibe': [
        'Descontraído', 'Alto astral', 'Intimista', 'Animado', 'Brega chic',
        'Vintage', 'Urbano', 'Tropical', 'Épico', 'Surpreendente',
        'Inesperado', 'Fotogênico', 'Instagramável'
    ],
    'perks': [
        'Entrada franca', 'Lista VIP', 'Desconto antecipado',
        'Happy hour extendido', 'Open bar limitado', 'Primeira bebida grátis',
        'PIX cashback', 'Estacionamento grátis', 'Bike rack', 'Pet friendly',
        'Acessível', 'Banheiro unissex', 'Wi-Fi liberado', 'Carga de celular'
    ],
    'publico': [
        'Para casais', 'Para solteiros', 'Grupos de amigos', 'After work',
        'Universitários', 'Turu bom', 'LGBTQ+ friendly', '+18', '+21',
        'Casal + single', 'Sem filhos', 'Criativo', 'Nômade digital'
    ],
    'promocoes': [
        'Pague 1 leve 2', 'Happy Hour em dobro', 'Desconto surpresa',
        'Promoção relâmpago', 'Combo festa', 'Entrada gratuita',
        'Primeira rodada grátis', 'Desconto antecipado', 'Lista VIP aberta',
        'Brinde exclusivo'
    ]
}

# 2.  build helper lists
mandatory_pools = [v for k, v in TAG_SEGMENTS.items()
                   if k not in {'perks', 'publico', 'promocoes'}]  # 7 lists

bonus_pool = [item for k, v in TAG_SEGMENTS.items() for item in v]  # all tags

# 3.  generate 103 rows
rows = []
for _ in range(103):
    # 7 mandatory: one random tag from each of the 7 allowed macro-categories
    mandatory = [random.choice(pool) for pool in mandatory_pools]

    # 7 bonus: any tag from the whole pool (with replacement)
    bonus = random.choices(bonus_pool, k=7)

    # merge -> 14 tags total
    tag_list = mandatory + bonus
    random.shuffle(tag_list)  # random order inside cell
    rows.append([str(tag_list)])  # write as string representation

# 4.  write CSV
with open('poi_tags.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['tags'])  # header
    writer.writerows(rows)

print('poi_tags.csv created with 103 rows × 14 tags each.')