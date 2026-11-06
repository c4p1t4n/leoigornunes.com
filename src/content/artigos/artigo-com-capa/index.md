---
title: 'Por que sistemas de trading são orientados a eventos'
description: 'Mercados produzem fluxos de eventos, não requisições. Entender isso muda como se desenha o sistema inteiro.'
date: 2026-11-05
tags: [tecnologia, mercado-financeiro, arquitetura]
cover: ./capa.svg
coverAlt: 'Capa de exemplo em azul-marinho com filete dourado'
featured: true
---

Um livro de ofertas não espera ninguém. Cada ordem, cancelamento e execução é um **evento** que chega quando chega.

## Eventos em vez de requisições

Em vez de perguntar "qual o preço agora?", o sistema reage a cada mudança:

```python
def on_trade(event):
    book.apply(event)
    if book.crossed():
        raise RuntimeError("livro cruzado: evento perdido?")
```

## Ordem importa

Reprocessar a mesma sequência de eventos deve produzir o mesmo estado.

## Conclusão

Modelar o domínio como fluxo de eventos facilita auditoria, replay e testes.
