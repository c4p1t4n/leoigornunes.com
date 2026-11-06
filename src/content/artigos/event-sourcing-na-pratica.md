---
title: 'Event sourcing na prática: o que ninguém conta'
description: 'Replay, snapshots e versionamento de eventos: os custos escondidos de guardar tudo.'
date: 2026-07-18
tags: [tecnologia, arquitetura]
---

Guardar eventos em vez de estado resolve auditoria, mas cria três problemas novos.

## Snapshots

Sem eles, reconstruir um agregado longo fica lento.

## Versionamento

Eventos antigos nunca mudam; o código que os lê, sim.

## Replay

Útil para corrigir bugs, perigoso quando há efeitos colaterais.
